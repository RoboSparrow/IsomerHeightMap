
describe("Module integration", function() {
    
    var ex = new TemplateModule('#Canvas' , '../');
    
    it("The module should have extended the core with it's options.", function() {
        expect(ex.options.hasOwnProperty('mDefaults1')).toBe(true);
        expect(ex.options.hasOwnProperty('mDefaults2')).toBe(true);
    });
    
    it("The types and values of the merged defaults should have been preserved.", function() {
        expect(typeof(ex.options.mDefaults1.aNumber)).toBe('number');
        expect(ex.options.mDefaults1.isNull).toBe(null);
        expect(ex.options.mDefaults1.isArray.length).toBe(3);
        expect(typeof(ex.options.mDefaults2.isDeepObject)).toBe('object');
        expect(ex.options.mDefaults2.isDeepObject.isBool).toBe(true);
        expect(typeof(ex.options.mDefaults2.isDeepObject.isObject)).toBe('object');
        expect(typeof(ex.options.mDefaults2.isDeepObject.isObject.saysHi)).toBe('string');
    });
    
    describe("Module integration", function() {
        
        beforeEach(function(done) {
            image = new Image();
            image.src = './image-2.png?cache=' + Date.now();
            image.onload = function(){
                ex.image(this);
                ex.render(null, {//test with grid options
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
                done();
            };
        });
        
    
        it("this.options should have been modified by this.render(options)", function(done) {
            expect(ex.options.mDefaults1.isArray.length).toBe(1);
            expect(ex.options.mDefaults1.isNull).toBe('value');
            expect(ex.options.mDefaults2.isDeepObject.isObject.saysHi).toBe('Hi again!');
            console.log(ex.options.mDefaults1, ex.options.mDefaults2);
            done();
        });
    
    });
        
});

//import,
//export
