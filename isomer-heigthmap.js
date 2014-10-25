
IsomerHeightMap.prototype = Object.create(ImageHeightMap.prototype);
IsomerHeightMap.prototype.constructor = ImageHeightMap;

function IsomerHeightMap(element, libPath, options){
    // super
    ImageHeightMap.call(this, libPath, options);
    this.target = this.utils.createElement(element, 'canvas');

    // module defaults, @see Isomer.js
    this.extend('isomer', {
        scale: 15,
        originX: null,
        originY: null
    });
    
    // module defaults, @see Shape.js
    this.extend('shape', {
        shape: 'Prism',
        greyscale: false,
        invert: false,
        size: 1,
        gap: 0,
        yScale: 1.5,
        baseHeight: 0.5
    });
}

IsomerHeightMap.prototype.onRender = function() {
    this.grid.reverse();
};

/**
 * Render heightmap row-by-row
 * @param {object} options Isomer instance options (this.options.isomer).
 * @param {object} filters Isomer shape options (this.options.shape). Passed on to the isomer renderer
 * @returns {void}
 */
IsomerHeightMap.prototype.display = function(options, filters) {
    // options and filters
    var filters = this.merge('shape', filters);
    var options = this.merge('isomer', options);

    // isomer instance
    this.isomer = new Isomer(this.target, options);

    // compute canvas dimensions (normalise to [x,y,z] to [x,y]) and inject into isomer options
    function canvas(grid, isomer, filters){
        var dim = {};
        var elementBaseW = Math.cos(isomer.angle) * (isomer.scale * (filters.size + filters.gap));
        var elementBaseH = Math.sin(isomer.angle) * (isomer.scale * (filters.size + filters.gap));
        dim = {};
        dim.origin = {
            left: elementBaseW * grid.length,    //rows
            right: elementBaseW * grid[0].length //columns
        }
        dim.box = {
            width: dim.origin.left + dim.origin.right,
            height: (elementBaseH * grid.length) + (elementBaseH * grid[0].length)//row + cols
        }
        return dim;
    }

    // canvas dimensions
    var dim = canvas(this.grid, this.isomer, filters);
    this.target.width = Math.ceil(dim.box.width);
    this.target.height = Math.ceil(dim.box.height + (3 * filters.yScale * options.scale) + (filters.baseHeight * this.isomer.scale));

    // isomer origins
    this.isomer.originX = Math.ceil(dim.origin.left);//place left edge on 0
    this.isomer.originY = this.target.height;

    // clear
    this.target.getContext('2d').clearRect(0, 0, this.target.width, this.target.height);

    // render
    var row = this.grid.length;
    while (row--) {
        var col = this.grid[row].length;
        while (col--) {
            this.heightMapTile(col, row, this.grid[row][col], filters);
        }
    }

    // trigger event
    this.fire(this.events.onDisplay);
};

/**
 * Render heightmap tile
 * @param {number} x Tile x pos (this.grid > column)
 * @param {number} y Tile y pos (this.grid > row)
 * @param {array} average Average color for this tile: [r, g, b, a].
 * @param {object} filters Isomer shape options (this.options.shape).
 * @returns {void}
 */
IsomerHeightMap.prototype.heightMapTile = function(x, y, average, filters) {
    average = this.utils.normalizeRGBAlpha(average);

    // filter: greyscale
    if (filters.greyscale) {
        var brightness = 0.34 * average[0] + 0.5 * average[1] + 0.16 * average[2];
        var colour = new Isomer.Color(brightness, brightness, brightness);
    } else {
        var colour = new Isomer.Color(average[0], average[1], average[2]);
    }

    // filter: invert
    if (filters.invert) {
        var height = (average[0] + average[1] + average[2]) / 255;
    } else {
        var height = ((3 * 255) - (average[0] + average[1] + average[2])) / 255;
    }

    // dimensions @TODO: move to parent (performance)
    height *= filters.yScale;
    height += filters.baseHeight;
    x *= filters.size + filters.gap;
    y *= filters.size + filters.gap;

    // filter: shape
    switch (filters.shape) {
        case 'Pyramid':
            this.isomer.add(Isomer.Shape.Pyramid(new Isomer.Point(x, y, 0), filters.size, filters.size, height), colour);
            break;
        case 'Cylinder':
            this.isomer.add(Isomer.Shape.Cylinder(new Isomer.Point(x, y, 0), filters.size/2, 15, height), colour);
            break;
        default:
            this.isomer.add(Isomer.Shape.Prism(new Isomer.Point(x, y, 0), filters.size, filters.size , height), colour);
    }
};
