TemplateModule.prototype = Object.create(ImageHeightMap.prototype);
TemplateModule.prototype.constructor = ImageHeightMap;

function TemplateModule(element, libPath, options){
    
    ImageHeightMap.call(this, element, libPath, options);
    
    // overwrite parent render callback
    this.onRender = function(isomerOptions, shapeFilters){
        console.log('I\'m a template callback.');
    };
    
};
