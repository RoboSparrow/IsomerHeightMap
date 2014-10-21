TemplateModule.prototype = Object.create(ImageHeightMap.prototype);
TemplateModule.prototype.constructor = ImageHeightMap;

function TemplateModule(element, libPath, options){
    
    ImageHeightMap.call(this, element, libPath, options);
    
    this.extend('mDefaults1', {
        aNumber: 15,
        isArray: [1, 2, 3],
        isNull: null
    });
    
    this.extend('mDefaults2', {
        isDeepObject: {
            isBool: true,
            isObject: {
                saysHi: 'Hi!'
            }
        }
    });
    

};

// overwrite parent render callback
TemplateModule.prototype.display = function(options1, options2){
    console.log('TemplateModule.prototype.onRender');
    console.log(options1, options2);
    options1 = this.merge('mDefaults1', options1);
    options2 = this.merge('mDefaults2', options2);
    console.log(this.options, options1, options2);
};

TemplateModule.prototype.hello = function(name){
    return 'Hello ' + name + '!';
};
