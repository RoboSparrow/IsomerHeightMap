
IsomerHeightMap.prototype = Object.create(ImageHeightMap.prototype);
IsomerHeightMap.prototype.constructor = ImageHeightMap;

function IsomerHeightMap(element, libPath, options){
    
    ImageHeightMap.call(this, element, libPath, options);
    
    // overwrite parent render callback
    this.onRender = function(isomerOptions, shapeFilters){
        // normalise for isomer rendering order and display
        this.grid.reverse();
        this.heightMap(isomerOptions, shapeFilters);
    };
    
    // module defaults, @see Isomer.js
    this.settings.extend('isomer', {
        scale: 15,
        originX: null,
        originY: null
    });
    
    // module defaults, @see Shape.js
    this.settings.extend('shape', {
        shape: 'Prism',
        greyscale: false,
        invert: false,
        size: 1,
        gap: 0,
        yScale: 1.5,
        baseHeight: 0.5
    });

}


/**
 * Render heightmap row-by-row
 * @param {object} options Isomer instance options (this.options.isomer).
 * @param {object} filters Isomer shape options (this.options.shape). Passed on to the isomer renderer
 * @returns {void}
 */
IsomerHeightMap.prototype.heightMap = function(options, filters) {

    // init event
    var event = new CustomEvent("IHM-Display-Finished");

    // options and filters
    var filters = this.merge(this.options.shape, filters);
    var options = this.merge(this.options.isomer, options);

    // isomer instance
    this.isomer = new Isomer(this.canvas, options);

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
    this.canvas.width = Math.ceil(dim.box.width);
    this.canvas.height = Math.ceil(dim.box.height + (3 * filters.yScale * options.scale) + (filters.baseHeight * this.isomer.scale));

    // isomer origins
    this.isomer.originX = Math.ceil(dim.origin.left);//place left edge on 0
    this.isomer.originY = this.canvas.height;

    // clear
    this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);

    // render
    var row = this.grid.length;
    while (row--) {
        var col = this.grid[row].length;
        while (col--) {
            this.heightMapTile(col, row, this.grid[row][col], filters);
        }
    }

    // trigger event
    this.canvas.dispatchEvent(this.events.onDisplay);
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
