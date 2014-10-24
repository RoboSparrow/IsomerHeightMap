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
    var mock = new MockModule('#Canvas', '../');
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
          
        mock.canvas.addEventListener('IHM-Display-Finished', function(event) {
            completed = true;
            event.target.removeEventListener(event.type, arguments.callee);
            
            var display = utils.appendDisplay('Image-1');
            display.appendChild(utils.gridToHtml(mock.grid));
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
//reset
//import,
//export
