// IsomerHeightMap v0.1.2 - Create isometric heightmaps from images. Based on jdan's excellent Isomer library.
// Copyright (c) 2014 Joerg Boeselt - https://github.com/RoboSparrow/IsomerHeightMap
// License: MIT

 /**
  * FileReader API
  * canvas
  * webworker
  * querySelector
  */
'use strict';

/**
 * Write Image to offCanvas and provide image data
 * @constructor
 * @param {string} canvasSelector Selecor for target canvas node.
 * @param {object} options Global options. Currently not used
 * @returns {void}
 */
var IsomerHeightMap = function(canvasSelector, libPath, options) {

    options = options || {};

    // base path (webworker)
    var libPath = libPath || './';

    // private defaults
    var defaults = {
        image: {
            scaleTo: {
                width: 600,
                height: 400
            }
        },
        grid: {
            unit: 15
        },
        // @see isomer.js
        isomer: {
            scale: 15,
            originX: null,
            originY: null
        },
        shape: {
            shape: 'Prism',
            greyscale: false,
            invert: false,
            size: 1,
            gap: 0,
            yScale: 1.5
        }
    };

    // declarations
    this.isomer;
    this.imageData;
    this.grid;
    this.options;

    //canvas
    this.canvas = document.querySelector(canvasSelector);

    // offCanvas
    this.offCanvas = document.createElement('canvas');
    this.offCanvas.id = 'IsomerHeightMapSource';

    // merge options into this.options.
    this.merge = function(thisOptions, merge) {
		for (var property in merge) {
			if(typeof thisOptions[property] === 'undefined'){
				continue;
			}
			if (typeof merge[property] === "object" && merge[property] !== null ) {
				thisOptions[property] = thisOptions[property] || {};
				this.merge(thisOptions[property], merge[property]);
			} else {
				thisOptions[property] = merge[property];
			}
		}
		return thisOptions;
	};

    // create this.options from defaults (init, reset)
    this.defaults = function() {
        this.options = JSON.parse(JSON.stringify(defaults));
    }

    // helpers
    this.utils = {};

    // normalise rgba to rgb, blend alpha as white background
    // @param {array} channels rgba value array: [0 - 255, 0 - 255, 0 - 255, 0 - 255]
    this.utils.normalizeRGBAlpha = function(channels){

        var rgb = [0, 0, 0];
        for(var i = 0; i < rgb.length; i++){
            var alpha = channels[3]/255;//imagedata alpha to rgb alpha
            rgb[i] = channels[i] * alpha + 255 * (1 - alpha);
        }
        return rgb;

    }

    // get libPath
	this.utils.libPath= function (){
		return libPath;
	}

    // init
    this.defaults();

};

/**
 * Write Image to offCanvas and provide image data
 * @param {object} image JavaScript Image object.
 * @param {object} options offCanvas options (this.options.image).
 * @returns {void}
 */
IsomerHeightMap.prototype.image = function(img, options) {

    options = this.merge(this.options.image, options);

    // scaling the image within the boundaries of defaults.image.max
    function scale(img, options) {
        var prop = (img.width >= img.height) ? 'width' : 'height';
        var scale = options.scaleTo[prop] / img[prop];
        return (scale < 1) ? scale : 1;
    }
    var factor = scale(img, options);

    // prepare offCanvas
    this.offCanvas.width = img.width * factor;
    this.offCanvas.height = img.height * factor;
    var context = this.offCanvas.getContext('2d');

    // draw and get imagedata
    context.drawImage(img, 0, 0, this.offCanvas.width, this.offCanvas.height);
    this.imageData = context.getImageData(0, 0, this.offCanvas.width, this.offCanvas.height);

}

/**
 * Compute grid from offCanvas and render isomer
 * @param {object} options Set grid options (this.options.grid)
 * @param {object} isomerOptions Isomer instance options (this.options.isomer). Passed on to the isomer renderer
 * @param {object} shapeFilters Isomer shape options (this.options.shape). Passed on to the isomer renderer
 * @returns {void}
 */
IsomerHeightMap.prototype.render = function(options, isomerOptions, shapeFilters) {

    options = this.merge(this.options.grid, options);

    var cols = Math.floor(this.imageData.width / options.unit);
    var rows = Math.floor(this.imageData.height / options.unit);

    // send data to worker.
    var worker = new Worker(this.utils.libPath() + 'webworker.js');
    worker.postMessage({
        pixels: this.imageData.data,
        meta: {
            width: this.imageData.width,
            height: this.imageData.height,
            cols: cols,
            rows: rows,
            tile: {
                width: options.unit,
                height: options.unit
            }
        }
    });

    // retrieve and parse worker messages
    var self = this;
    worker.addEventListener('message', function(e) {
        if (e.data.complete) {
            console.log('All pixels processed. Rendering html');
            self.grid = e.data.response;
            // normalise for isomer rendering order
            self.grid.reverse();
            // render
            self.heightMap(options, isomerOptions, shapeFilters);
            return;
        }
    }, false);

    worker.onerror = function(event) {
        console.warn(event.message, event); // @TODO
    };

};

/**
 * Render heightmap row-by-row
 * @param {object} options Isomer instance options (this.options.isomer).
 * @param {object} filters Isomer shape options (this.options.shape). Passed on to the isomer renderer
 * @returns {void}
 */
IsomerHeightMap.prototype.heightMap = function(options, filters) {

	// init event
	var event = new CustomEvent("IHM-Render-Finished");

    // options and filters
    var filters = this.merge(this.options.shape, filters);
    var options = this.merge(this.options.isomer, options);

    // isomer instance
    this.isomer = new Isomer(this.canvas, options);

    // compute canvas dimensions and inject into isomer options
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
    this.canvas.height = Math.ceil(dim.box.height + (3 * filters.yScale * options.scale));

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
	this.canvas.dispatchEvent(event);
}

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

/**
 * Exports current grid and settings
 * @returns {string} json
 */
IsomerHeightMap.prototype.export = function(){

	var ex = {};
	ex.options = this.options || null;
	ex.grid = this.grid || null;
	ex.timestamp = new Date().toISOString()
	return JSON.stringify(ex);

}

/**
 * Import grid and settings fom json
 * @param {string} json
 * @returns {void}
 */
IsomerHeightMap.prototype.import = function(json){

	try {
		var imp = JSON.parse(json);
	}catch(e) {
		alert(e);
		return;
	}

	if(typeof imp.options === 'undefined' || typeof imp.grid === 'undefined'){
		alert('Invalid IsomerHeightMap data.');
		return;
	}

	if(imp.options){
		this.options = imp.options;
	}
	if(imp.grid){
		this.grid = imp.grid;
	}

}
