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
        
        ihm.merge('image', {scaleTo: {width: 123}});
        ihm.merge('grid', {unit: 12});
        ihm.merge('newProperty', {illegal: 'illegal'});
        ihm.merge('grid', {illegal: 'illegal'});

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

        it("should not allow the creation of new properties in existing sections.", function() {
            expect(typeof(ihm.options.grid.illegal)).toBe('undefined');
        });
        
        describe("Saving and getting of defaults.", function() {
            var defaults = ihm.defaults.get();

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
        var completed = false;
            
        beforeEach(function(done) {
            if(completed){
                done();
                return;
            }
            image = new Image();
            image.src = './image-1.png?cache=' + Date.now();
            image.onload = function(){
                ihm.image(this);
                completed = true;
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
    
    describe("Fire Event", function() {
        var ihm = new ImageHeightMap('#Canvas', '../');
        var image;
        var eventFired = false;
        
        ihm.canvas.addEventListener('IHM-Image-Finished', function(event) {
            eventFired = true;
            // remove this handler
            event.target.removeEventListener(event.type, arguments.callee);
        });
        
        beforeEach(function(done) {
            if(eventFired){
                done();
                return;
            }

            image = new Image();
            image.src = './image-2.png?cache=' + Date.now();
            image.onload = function(){
                ihm.image(this);
                done();
            };
        });
        
        it("should have fired an event on completion.", function(done) {
            expect(eventFired).toBe(true);
            done();
        });        
    });
    
});

describe("Grid", function() {
    
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
                
                var display = utils.appendDisplay('Image-1');
                display.appendChild(ihm.offCanvas);
            };
            
            ihm.canvas.addEventListener('IHM-Render-Finished', function(event) {
                completed = true;
                // remove this handler
                event.target.removeEventListener(event.type, arguments.callee);
                done();
            });
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
        
    });
    
    describe("Testing the grid data and options.", function() {
        
        var ihm = new ImageHeightMap('#Canvas', '../');
        var image;
        var completed = false;
        var unit = 5;

        beforeEach(function(done) {
            if(completed){
                done();
                return;
            }

            image = new Image();
            image.src = './image-1.png?cache=' + Date.now();
            image.onload = function(){
                ihm.image(this);
                var display = utils.appendDisplay('Image-2');
                display.appendChild(ihm.offCanvas);
                ihm.render({unit: unit});
                completed = true;
            };

            ihm.canvas.addEventListener('IHM-Render-Finished', function(event) {
                var display = utils.appendDisplay('Image-2');
                display.appendChild(utils.gridToHtml(ihm.grid));
                // remove this handler
                event.target.removeEventListener(event.type, arguments.callee);
                done();
            });
            
        });
          
        it("The grid size should be proportional to the unit size.", function(done) {
            expect(ihm.grid.length).toBe(40/unit);//rows
            expect(ihm.grid[0].length).toBe(40/unit);//cols
            done();
        });

        it("The grid colors should match the image colours.", function(done) {
            expect(ihm.grid[0][0].toString()).toBe([0, 0 ,0, 255].toString());
            expect(ihm.grid[ihm.grid.length - 1][ihm.grid[0].length - 1].toString()).toBe([255, 0 ,0, 255].toString());
            done();
        });

    });
    
});

describe("Import & Export", function() {
     
    describe("Export", function() {
        
        var ihm = new ImageHeightMap('#Canvas', '../');
        var image;
        var completed = false;
        var exported;

        beforeEach(function(done) {
            if(completed){
                done();
                return;
            }

            image = new Image();
            image.src = './image-2.png?cache=' + Date.now();
            image.onload = function(){
                ihm.image(this);
                var display = utils.appendDisplay('Image-2');
                display.appendChild(ihm.offCanvas);
                ihm.render();
                completed = true;
            };
        
            ihm.canvas.addEventListener('IHM-Render-Finished', function(event) {
                exported = ihm.export();
                var display = utils.appendDisplay('Image-2');
                display.appendChild(utils.gridToHtml(ihm.grid));
                // remove this handler
                event.target.removeEventListener(event.type, arguments.callee);
                done();
            });
            
        });

        it("Should export all options as JSON.", function(done) {
            var data = JSON.parse(exported);
            expect(data.options.hasOwnProperty('image')).toBe(true);
            expect(data.options.hasOwnProperty('grid')).toBe(true);
            done();
        });
        
        it("The exported data should match the default options.", function(done) {
            var data = JSON.parse(exported);
            expect(data.options.image.scaleTo.width).toBe(ihm.options.image.scaleTo.width);
            expect(data.options.grid.unit).toBe(ihm.options.grid.unit);
            done();
        });

        it("The exported grid data should be of the same size as this.grid.", function(done) {
            var data = JSON.parse(exported);
            expect(data.grid.length).toBe(ihm.grid.length);//rows
            expect(data.grid[0].length).toBe(ihm.grid[0].length);//cols
            done();
        });
        
    });
    
    describe("Import", function() {
        
        var ihm = new ImageHeightMap('#Canvas', '../');
        ihm.merge('grid', {unit: 20});
        
        var image;
        var exported;
        var completed = false;

        beforeEach(function(done) {
            if(completed){
                done();
                return;
            }

            image = new Image();
            image.src = './image-2.png?cache=' + Date.now();
            image.onload = function(){
                ihm.image(this);
                var display = utils.appendDisplay('Image-3');
                display.appendChild(ihm.offCanvas);
                ihm.render();
                completed = true;
            };

            ihm.canvas.addEventListener('IHM-Render-Finished', function(event) {
                //export data
                exported = ihm.export();
                
                var display = utils.appendDisplay('Image-3');
                display.appendChild(utils.gridToHtml(ihm.grid));
                // remove this handler
                event.target.removeEventListener(event.type, arguments.callee);
                done();
            });
            
        });

        it("should have overwritten all options.", function(done) {
            var newIhm = new ImageHeightMap('#Canvas', '../../');
            newIhm.merge('grid', {unit: 20});
            newIhm.extend('test', {test: 'value'});
            
            newIhm.import(exported);
            
            expect(newIhm.options.unit).toBe(ihm.options.unit);
            expect(typeof(newIhm.options.test)).toBe('undefined');
            expect(newIhm.defaults.libPath()).not.toBe(ihm.defaults.libPath());
            done();
        });
        
        it("should have grid data.", function(done) {
            var newIhm = new ImageHeightMap('#Canvas', '../');
            newIhm.import(exported);

            var display = utils.appendDisplay('Image-3');
            display.appendChild(utils.gridToHtml(newIhm.grid));
            
            expect(newIhm.grid.length).toBe(ihm.grid.length);//rows
            expect(newIhm.grid[0].length).toBe(ihm.grid[0].length);//cols
            done();
        });
        
        
    });
    
});
//import,
//export
