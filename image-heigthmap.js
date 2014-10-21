// IsomerHeightMap v0.1.2 - Create isometric heightmaps from images. Based on jdan's excellent Isomer library.
// Copyright (c) 2014 Joerg Boeselt - https://github.com/RoboSparrow/IsomerHeightMap
// License: MIT

 /**
  * Requirements
  * FileReader API (ui only)
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
var ImageHeightMap = function(element, libPath, options) {

    options = options || {};

    // base path (webworker)
    var libPath = libPath || './';

    // private defaults
    this.options = {
        image: {
            scaleTo: {
                width: 600,
                height: 400
            }
        },
        grid: {
            unit: 15
        }
    };

    // declarations
    var defaults;
    this.isomer;
    this.imageData;
    this.worker;
    this.grid;
    this.onRender = function(){};
    this.events = {
        onImage:    new CustomEvent("IHM-Image-Finished"),
        onRender:   new CustomEvent("IHM-Render-Finished"),
        onDisplay:  new CustomEvent("IHM-Display-Finished")
    };

   //create canvas from node or selector
    function canvas(element){
        if(typeof element === 'string'){
            element = document.querySelector(element);
        }
        if(element instanceof HTMLCanvasElement){
            return element;
        }
        var canvas = document.createElement('canvas');
        element.appendChild(canvas);
        return canvas;
    }
    
    // deep merge options
    function merge(src, options){
        for (var property in options) {
            if(typeof src[property] === 'undefined'){
                continue;
            }
            if (typeof options[property] === "object" && options[property] !== null ) {
                src[property] = src[property] || {};
                src[property] = merge(src[property], options[property]);
            } else {
                src[property] = options[property];
            }
        }
        return src;
    }
    
    // create this.options from defaults (init, reset)
    this.settings = {
        // store defaults
        defaults: function() {
            return JSON.parse(defaults);
        },
        // merge run-time-options into this.options
        merge: function(src, options) {
            return merge(src, options);
        },
    };

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
    this.utils.libPath = function (){
        return libPath;
    };

    // init
    defaults = JSON.stringify(this.options);
    //canvas
    this.canvas = canvas(element);
    // offCanvas
    this.offCanvas = document.createElement('canvas');

};

/**
 * Write Image to offCanvas and provide image data
 * @param {object} image JavaScript Image object.
 * @param {object} options offCanvas options (this.options.image).
 * @returns {void}
 */
ImageHeightMap.prototype.image = function(img, options) {
    
    options = this.settings.merge(this.options.image, options);

    // scale the image within the boundaries of defaults.image.scaleTo
    function scale(img, maxWidth, maxHeight) {
        var wQ = options.scaleTo.width / img.width;
        var hQ = options.scaleTo.height / img.height;
        var scale = (wQ < hQ) ? wQ : hQ;
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
    
    // trigger event
    this.canvas.dispatchEvent(this.events.onImage);
};

/**
 * Compute grid from offCanvas and render isomer
 * @param {object} options Set grid options (this.options.grid)
 * @param {object} isomerOptions Isomer instance options (this.options.isomer). Passed on to the isomer renderer
 * @param {object} shapeFilters Isomer shape options (this.options.shape). Passed on to the isomer renderer
 * @returns {void}
 */
ImageHeightMap.prototype.render = function(options) {

    options = this.settings.merge(this.options.grid, options);
    
    // prepare args for onRender call
    var args = Array.prototype.slice.call(arguments);
    args.shift();

    var cols = Math.floor(this.imageData.width / options.unit);
    var rows = Math.floor(this.imageData.height / options.unit);

    // send data to worker.
    this.worker = new Worker(this.utils.libPath() + 'webworker.js');
    this.worker.postMessage({
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
    this.worker.addEventListener('message', function(e) {
        if (e.data.complete) {
            console.log('All pixels processed. Rendering html');
            //event
            self.grid = e.data.response;
            //callback
            self.onRender.apply(self, args);
            // trigger event
            self.canvas.dispatchEvent(self.events.onRender);
            return;
        }
    }, false);

    this.worker.onerror = function(event) {
        console.warn(event.message, event); // @TODO
    };

};

/**
 * Extends defaults bu module defaults
 * @param {string} section the key identifier for the merged defaults
 * @param {object} moduleDefaults
 * @returns {void}
 */
ImageHeightMap.prototype.extend = function(section, moduleDefaults) {
            this.options[section] = moduleDefaults;
};

/**
 * Reset to defaults
 * @returns {void}
 */
ImageHeightMap.prototype.reset = function(){
    this.options = this.settings.defaults();
};

/**
 * Exports current grid and settings
 * @returns {string} json
 */
ImageHeightMap.prototype.export = function(){

    var ex = {};
    ex.options = this.options || null;
    ex.grid = this.grid || null;
    ex.timestamp = new Date().toISOString()
    return JSON.stringify(ex);

};

/**
 * Import grid and settings fom json
 * @param {string} json
 * @returns {void}
 */
ImageHeightMap.prototype.import = function(json){

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

};
