
// specs code
describe("DOM canvas", function() {

    it("should accept a DOM <canvas> selector", function() {
        var ihm = new ImageHeightMap('#Canvas');
        expect(ihm.canvas.tagName).toBe('canvas'.toUpperCase());
    });

    it("should accept a DOM <canvas> element", function() {
        var canvas = document.getElementById('Canvas');
        var ihm = new ImageHeightMap(canvas);
        expect(ihm.canvas.tagName).toBe('canvas'.toUpperCase());
    });

    it("should accept a wrapper selector element and create a <canvas> element", function() {
        var element = document.querySelector('.init .wrapper');
        var ihm = new ImageHeightMap(element);
        expect(ihm.canvas.tagName).toBe('canvas'.toUpperCase());
    });
    
    document.querySelector('.wrapper').innerHTML = '';
    
    it("should accept a DOM wrapper element and create a <canvas> element", function() {
        var ihm = new ImageHeightMap('.init .wrapper');
        expect(ihm.canvas.tagName).toBe('canvas'.toUpperCase());
    });
});

describe("Options and defaults", function() {
    var ihm = new ImageHeightMap('#Canvas');
    
    it("should have a default set of options.", function() {
        expect(typeof(ihm.options)).toBe('object');
        expect(ihm.options.hasOwnProperty('image')).toBe(true);
        expect(ihm.options.hasOwnProperty('grid')).toBe(true);
    });
    
    //store some initial values
    var initImageOptWidth = ihm.options.image.scaleTo.width;
    var initIGridOptUnit = ihm.options.grid.unit;
    
    describe("Merge options.", function() {
        
        ihm.settings.merge(ihm.options.image, {scaleTo: {width: 123}});
        ihm.settings.merge(ihm.options.grid, {unit: 12});
        ihm.settings.merge(ihm.options, {illegal: 'illegal'});
        ihm.settings.merge(ihm.options.grid, {illegal: 'illegal'});

        it("should have merged new values for existing options.", function() {
            expect(ihm.options.grid.unit).toBe(12);
        });
        
        it("should have deep-merged new values for existing options.", function() {
            expect(ihm.options.image.scaleTo.width).toBe(123);
            expect(ihm.options.grid.unit).toBe(12);
        });
        
        it("should not allow the creation of new sections.", function() {
            expect(typeof(ihm.options.illegal)).toBe('undefined');
        });

        it("should not allow the creation of new properties in existin gsections.", function() {
            expect(typeof(ihm.options.grid.illegal)).toBe('undefined');
        });
        
        describe("Saving and getting of defaults.", function() {
            var defaults = ihm.settings.defaults();
            
            it("should have saved the initial options as JSON.", function() {
                expect(typeof(defaults)).toBe('object');
                expect(defaults.hasOwnProperty('image')).toBe(true);
                expect(defaults.hasOwnProperty('grid')).toBe(true);
            });
            
            it("should have not changed the defaults.", function() {
                expect(defaults.image.scaleTo.width).toBe(initImageOptWidth);
                expect(defaults.grid.unit).toBe(initIGridOptUnit);
            });
        });
        
        describe("Restoring options to defaults.", function() {
            it("should have reset all options to the defaults.", function() {
                ihm.reset();
                expect(ihm.options.image.scaleTo.width).toBe(initImageOptWidth);
                expect(ihm.options.grid.unit).toBe(initIGridOptUnit);
            });
        });

    });
    
});

describe("Image and Grid", function() {
    
    var ihm = new ImageHeightMap('#Canvas', '../');
    var img = new Image();
    img.src = './image-1.png';
    
    beforeEach(function(done) {
        img.onload = function(){
            ihm.image(img);
            done();
        };
    });
    
    it("should have created a canvas object with image data.", function(done) {
        var display = utils.appendDisplay('Image-1');
        display.appendChild(ihm.offCanvas);
        console.log(img.width, ihm.imageData.width);
        expect(ihm.imageData.width).toBe(img.width);
        expect(ihm.imageData.height).toBe(img.height);
        
        done();
    });
});
