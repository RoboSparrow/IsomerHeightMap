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
 * Write Image to buffer and provide image data
 * @constructor
 * @param {object} options Global options. Currently not used
 * @returns {void}
 */
var ImageHeightMap = function(libPath, options) {
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
    this.imageData;
    this.worker;
    this.grid;
    this.buffer;
    this.events = {
        onImage: 'IHM-Image-Finished',
        onRender: 'IHM-Render-Finished',
        onDisplay: 'IHM-Display-Finished'
    };

    // create this.options from defaults (init, reset)
    this.defaults = {
        // store defaults
        get: function() {
            return JSON.parse(defaults);
        },
        set: function(options) {
            defaults = JSON.stringify(options);
        },
        libPath: function(){
            return libPath;
        }
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

    // deep merge options
    this.utils.merge = function(src, options){
        var self = this;
        for (var property in options) {
            if(typeof src[property] === 'undefined'){
                continue;
            }
            if(options[property] instanceof Array){
                src[property] = options[property];
                continue;
            }
            if(typeof options[property] === "object" && options[property] !== null) {
                src[property] = src[property] || {};
                src[property] = self.merge(src[property], options[property]);
                continue;
            }
            src[property] = options[property];
        }
        return src;
    };

    // Create element from node or selector
    // Helper for display functions of modules.
    this.utils.createElement = function (element, tagName){
        tagName = tagName || 'canvas';
        
        if(typeof element === 'string'){
            element = document.querySelector(element);
        }
        if(element.tagName.toLowerCase() === tagName.toLowerCase()){
            return element;
        }
        var node = document.createElement(tagName.toLowerCase());
        element.appendChild(node);
        return node;
    };

    // init
    this.defaults.set(this.options);
    this.buffer = document.createElement('canvas');
};

/**
 * Write Image to buffer and provide image data
 * @param {object} image JavaScript Image object.
 * @param {object} options buffer options (this.options.image).
 * @returns {void}
 */
ImageHeightMap.prototype.image = function(img, options) {
    options = this.merge('image', options);

    // scale the image within the boundaries of defaults.image.scaleTo
    function scale(img, maxWidth, maxHeight) {
        var wQ = options.scaleTo.width / img.width;
        var hQ = options.scaleTo.height / img.height;
        var scale = (wQ < hQ) ? wQ : hQ;
        return (scale < 1) ? scale : 1;
    }
    var factor = scale(img, options);

    // prepare buffer
    this.buffer.width = img.width * factor;
    this.buffer.height = img.height * factor;
    var context = this.buffer.getContext('2d');

    // draw and get imagedata
    context.drawImage(img, 0, 0, this.buffer.width, this.buffer.height);
    this.imageData = context.getImageData(0, 0, this.buffer.width, this.buffer.height);
    
    // trigger event
    this.fire(this.events.onImage);
};

/**
 * Compute grid from buffer and render isomer
 * @param {object} options Set grid options (this.options.grid)
 * @param {object} isomerOptions Isomer instance options (this.options.isomer). Passed on to the isomer renderer
 * @param {object} shapeFilters Isomer shape options (this.options.shape). Passed on to the isomer renderer
 * @returns {void}
 */
ImageHeightMap.prototype.render = function(options) {
    options = this.merge('grid', options);
    
    // prepare args for onRender call
    var args = Array.prototype.slice.call(arguments);
    args.shift();

    var cols = Math.floor(this.imageData.width / options.unit);
    var rows = Math.floor(this.imageData.height / options.unit);

    // send data to worker.
    this.worker = new Worker(this.defaults.libPath() + 'webworker.js');
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
            // data
            self.grid = e.data.response;
            // trigger event
            self.fire(self.events.onRender);
            // callback
            if(typeof self.display === 'function'){
                self.display.apply(self, args);
            }

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
    this.defaults.set(this.options);
};

/**
 * Extends merge run-time options into this.options
 * @param {string} section the key identifier for the merged defaults
 * @param {object} moduleDefaults
 * @returns {object} updated section of this.options
 */
ImageHeightMap.prototype.merge = function(section, options) {
    options = options || {};
    if(!this.options.hasOwnProperty(section)){
        return options;
    }
    return this.utils.merge(this.options[section], options);
};

/**
 * Reset to defaults
 * @returns {void}
 */
ImageHeightMap.prototype.reset = function(){
    this.options = this.defaults.get();
};

/**
 * Dispatches an Event at the buffer canvas
 * @param {string} eventName
 * @returns {void}
 */
ImageHeightMap.prototype.fire = function(eventName){
    this.buffer.dispatchEvent(new CustomEvent(eventName));
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
