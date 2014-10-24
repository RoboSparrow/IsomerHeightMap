MockModule.prototype = Object.create(ImageHeightMap.prototype);
MockModule.prototype.constructor = ImageHeightMap;

function MockModule(element, libPath, options){
    
    ImageHeightMap.call(this, element, libPath, options);
    
    this.extend('mock1', {
        aNumber: 15,
        isArray: [1, 2, 3],
        isNull: null
    });

    this.extend('mock2', {
        isDeepObject: {
            isBool: true,
            isObject: {
                saysHi: 'Hi!'
            }
        }
    });

};

// overwrite parent render callback
MockModule.prototype.display = function(options1, options2){
    options1 = this.merge('mock1', options1);
    options2 = this.merge('mock2', options2);

    // trigger event
    this.fire(this.events.onDisplay);
};
