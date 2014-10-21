TemplateModule.prototype = Object.create(ImageHeightMap.prototype);
TemplateModule.prototype.constructor = ImageHeightMap;

function TemplateModule(element, libPath, options){
    
    ImageHeightMap.call(this, element, libPath, options);
    
    this.extend('mDefaults1', {
        aNumber: 15,
        isNull: null,
        isArray: [1, 2, 3]
    });
    
    this.extend('mDefaults2', {
        isDeepObject: {
            isBool: true,
            isObject: {
                saysHi: 'Hi!'
            }
        }
    });
    
    // overwrite parent render callback
    this.onRender = function(options1, options2){
        this.settings.merge(this.mDefaults1);
        this.settings.merge(this.mDefaults2);
    };
};

TemplateModule.prototype.hello = function(name){
    return 'Hello ' + name + '!';
};
