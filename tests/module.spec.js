describe("Module integration", function() {
 
    var mock = new MockModule('#Canvas' , '../');
    
    it("The module should have extended the core with it's options.", function() {
        expect(mock.options.hasOwnProperty('mock1')).toBe(true);
        expect(mock.options.hasOwnProperty('mock2')).toBe(true);
    });
    
    it("The types and values of the merged defaults should have been preserved.", function() {
        expect(typeof(mock.options.mock1.aNumber)).toBe('number');
        expect(mock.options.mock1.isNull).toBe(null);
        expect(mock.options.mock1.isArray.length).toBe(3);
        expect(typeof(mock.options.mock2.isDeepObject)).toBe('object');
        expect(mock.options.mock2.isDeepObject.isBool).toBe(true);
        expect(typeof(mock.options.mock2.isDeepObject.isObject)).toBe('object');
        expect(typeof(mock.options.mock2.isDeepObject.isObject.saysHi)).toBe('string');
    });
 
});

describe("Load Image and call module display.", function() {
    var mock = new MockModule('#Test', '../');
    var completed = false;
    
    beforeEach(function(done) {
        if(completed){
            done();
            return;
        }
        var image = new Image();
        image.src = './image-2.png?cache=' + Date.now(); 
        image.onload = function(){
            mock.image(this);
            mock.render({
                unit: 10
            }, 
            {
                isArray: [1], 
                isNull: 'value'
            }, 
            {
                isDeepObject:{
                    isObject:{
                        saysHi: 'Hi again!'
                    }
                }
            });
        }; 

        mock.buffer.addEventListener('IHM-Display-Finished', function(event) {
            completed = true;
            event.target.removeEventListener(event.type, arguments.callee);
            done();
        });
    });
    
    it("this.options.grid should have been modified.", function(done) {
        expect(mock.options.grid.unit).toBe(10);
        done();
    });
    
    it("this.options should have been modified by this.render(options)", function(done) {
        expect(mock.options.mock1.isArray.length).toBe(1);
        expect(mock.options.mock1.isNull).toBe('value');
        expect(mock.options.mock2.isDeepObject.isObject.saysHi).toBe('Hi again!');
        done();
    });
    
});


describe("Reset to module defaults.", function() {
    var mock = new MockModule('#Test', '../');
    var exported;
    
    describe("Change options, render and export.", function() {
        var completed = false;
        
        beforeEach(function(done) {
            if(completed){
                done();
                return;
            }
            var image = new Image();
            image.src = './image-2.png?cache=' + Date.now(); 
            image.onload = function(){
                mock.image(this);
                mock.render({
                    unit: 5
                }, 
                {
                    isArray: [1], 
                    isNull: 'value'
                }, 
                {
                    char: '#',
                    isDeepObject:{
                        isObject:{
                            saysHi: 'Hi again!'
                        }
                    }
                });
            }; 
            
            mock.buffer.addEventListener('IHM-Display-Finished', function(event) {
                completed = true;
                event.target.removeEventListener(event.type, arguments.callee);
                
                exported = mock.export();
                done();
            });
        });
        
        it("Core and module options shauld have been modified", function(done) {
            expect(mock.options.grid.unit).toBe(5);
            expect(mock.options.mock1.isArray.length).toBe(1);
            expect(mock.options.mock1.isNull).toBe('value');
            expect(mock.options.mock2.isDeepObject.isObject.saysHi).toBe('Hi again!');
            expect(mock.options.mock2.char).toBe('#');
            done();
        });

        it("The exported json should hold the grid data, core options and module options", function(done) {
            var modifieds = JSON.parse(exported);
            
            expect(modifieds.hasOwnProperty('grid')).toBe(true);
            expect(modifieds.hasOwnProperty('options')).toBe(true);
            expect(modifieds.options.hasOwnProperty('image')).toBe(true);
            expect(modifieds.options.hasOwnProperty('grid')).toBe(true);
            expect(modifieds.options.hasOwnProperty('mock1')).toBe(true);
            expect(modifieds.options.hasOwnProperty('mock2')).toBe(true);
            done();
        });

        it("The values of the exported grid data, core options and module options should match", function(done) {
            var ex = JSON.parse(exported);
            
            expect(ex.options.grid.unit).toBe(mock.options.grid.unit);
            expect(ex.options.mock1.isArray.length).toBe(mock.options.mock1.isArray.length);
            expect(ex.options.mock1.isNull).toBe(mock.options.mock1.isNull);
            expect(ex.options.mock2.isDeepObject.isObject.saysHi).toBe(mock.options.mock2.isDeepObject.isObject.saysHi);
            
            expect(ex.grid.length).toBe(mock.grid.length);
            expect(ex.grid[0].length).toBe(mock.grid[0].length);
            done();
        });
        
        describe("Resetting options to defaults.", function() {
            it("The values of the core options and module options should have been reset.", function(done) {
                mock.reset();
                mock.display(); 
                var ex = JSON.parse(exported); 
               
                console.log(mock.options,ex);
                expect(ex.options.grid.unit).not.toBe(mock.options.grid.unit);
                expect(ex.options.mock1.isArray.length).not.toBe(mock.options.mock1.isArray.length);
                expect(ex.options.mock1.isNull).not.toBe(mock.options.mock1.isNull);
                expect(ex.options.mock2.isDeepObject.isObject.saysHi).not.toBe(mock.options.mock2.isDeepObject.isObject.saysHi);
                expect(ex.options.mock2.char).not.toBe(mock.options.mock2.char);
    
                done();
            });
            
            it("On importing the exported data grid and options should have been modified again.", function(done) {
                mock.import(exported);
                mock.display();
                
                expect(mock.options.grid.unit).toBe(5);
                expect(mock.options.mock1.isArray.length).toBe(1);
                expect(mock.options.mock1.isNull).toBe('value');
                expect(mock.options.mock2.isDeepObject.isObject.saysHi).toBe('Hi again!');
                done();
            });
        });
        
    });
    
});

