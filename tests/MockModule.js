MockModule.prototype = Object.create(ImageHeightMap.prototype);
MockModule.prototype.constructor = ImageHeightMap;

function MockModule(element, libPath, options){
    
    ImageHeightMap.call(this, libPath, options);
    this.target = this.utils.createElement(element, 'div');
    
    this.extend('mock1', {
        aNumber: 15,
        isArray: [1, 2, 3],
        isNull: null
    });

    this.extend('mock2', {
        char: '@',
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

    function grid2Html(char, grid){
        var node = document.createElement('table');
        var html = [];
        for(var row = 0; row < grid.length; row++){
            html.push('<tr>');
            for(var col = 0; col < grid[row].length; col++){
                var style = 'background-color: rgba(' + grid[row][col].toString() + ');';
                html.push('<td style="' + style + '">');
                html.push(char);
                html.push('</td>');
            }
            html.push('</tr>');
        }
        node.innerHTML =  html.join("\n");
        return node;
    };
    
    this.target.appendChild( grid2Html(options2.char, this.grid) );
    this.fire(this.events.onDisplay);
};
