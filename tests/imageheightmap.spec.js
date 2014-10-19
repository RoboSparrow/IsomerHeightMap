describe("DOM & canvas", function() {

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

describe("Image", function() {

    describe("Load Image", function() {
        var ihm = new ImageHeightMap('#Canvas', '../');
        var image;
        
        beforeEach(function(done) {
            image = new Image();
            image.src = './image-1.png?cache=' + Date.now();
            image.onload = function(){
                ihm.image(this);
                done();
            };
        });
        
        it("should have created a canvas object with image data.", function(done) {
            var display = utils.appendDisplay('Image-1');
            display.appendChild(ihm.offCanvas);
            expect(ihm.imageData.width).toBe(image.width);
            expect(ihm.imageData.height).toBe(image.height);
            done();
        });
        
        it("OffCanvas shold have the same dimensions as the image.", function(done) {
            var display = utils.appendDisplay('Image-1');
            display.appendChild(ihm.offCanvas);
            expect(ihm.imageData.width).toBe(image.width);
            expect(ihm.imageData.height).toBe(image.height);
            done();
        });
        
    });

    describe("Load a second Image", function() {
        var ihm = new ImageHeightMap('#Canvas', '../');
        var image;
        
        beforeEach(function(done) {
            image = new Image();
            image.src = './image-2.png?cache=' + Date.now();
            image.onload = function(){
                ihm.image(this);
                done();
            };
        });
        
        it("OffCanvas should have the same dimensions as the image.", function(done) {
            var display = utils.appendDisplay('Image-1');
            display.appendChild(ihm.offCanvas);
            expect(ihm.imageData.width).toBe(image.width);
            expect(ihm.imageData.height).toBe(image.height);
            done();
        });
        
    });


    describe("Load Image and scale offCanvas to maximum height.", function() {
        var ihm = new ImageHeightMap('#Canvas', '../');
        var image;
        var maxHeight;
        
        beforeEach(function(done) {
            image = new Image();
            image.src = './image-2.png?cache=' + Date.now();
            image.onload = function(){
                maxHeight = this.height/2;
                ihm.image(this, {scaleTo: {height: maxHeight}});
                done();
            };
        });
        
        it("OffCanvas height should be half of image height.", function(done) {
            var display = utils.appendDisplay('Image-1');
            display.appendChild(ihm.offCanvas);
            expect(ihm.imageData.height).toBe(maxHeight);
            done();
        });
    });

    describe("Load Image and scale offCanvas to maximum width.", function() {
        var ihm = new ImageHeightMap('#Canvas', '../');
        var image;
        var maxWidth;
        
        beforeEach(function(done) {
            image = new Image();
            image.src = './image-2.png?cache=' + Date.now();
            image.onload = function(){
                maxWidth = this.width/2;
                ihm.image(this, {scaleTo: {width: maxWidth}});
                done();
            };
        });
        
        it("OffCanvas height should be half of image width.", function(done) {
            var display = utils.appendDisplay('Image-1');
            display.appendChild(ihm.offCanvas);
            expect(ihm.imageData.width).toBe(maxWidth);
            done();
        });
    });
    
});

describe("Grid", function() {
    
    var unit;
    
    describe("Rendering a grid from image.", function() {
        
        var ihm = new ImageHeightMap('#Canvas', '../');
        var image;
        var completed = false;
        
        beforeEach(function(done) {
            if(completed){
                done();
                return;
            }
            image = new Image();
            image.src = './image-1.png?cache=' + Date.now();
            image.onload = function(){
                maxWidth = this.width/2;
                ihm.image(this, {scaleTo: {width: maxWidth}});
                ihm.render();
                
                var display = utils.appendDisplay('Image-2');
                display.appendChild(ihm.offCanvas);

                ihm.canvas.addEventListener('IHM-Render-Finished', function(event) {
                    completed = true;
                    done();
                });
            };
        });

        it("should have fired an event on completion.", function(done) {
            expect(completed).toBe(true);
            done();
        });
        it("should have created a two-dimensional grid array.", function(done) {
            expect(Object.prototype.toString.call(ihm.grid)).toBe('[object Array]');
            expect(ihm.grid.length).toBeGreaterThan(0);
            done();
        });
        it("The grid array should contain an array of rows.", function(done) {
            expect(Object.prototype.toString.call(ihm.grid[0])).toBe('[object Array]');
            expect(ihm.grid[0].length).toBeGreaterThan(0);//r,g,b,a
            done();
        });
        it("The rows should contain an array of rgba colour values.", function(done) {
            expect(Object.prototype.toString.call(ihm.grid[0][0])).toBe('[object Array]');
            expect(ihm.grid[0][0].length).toBe(4);//r,g,b,a
            done();
        });
        //first color
        //last color
        //row num
        //col num
        //uni
        //callback
        
    });

});

describe("Module integration", function() {
    xit("should be tested.");
});
