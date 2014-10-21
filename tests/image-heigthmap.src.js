var utils = {};

utils.appendDisplay = function(id){
    var wrapper = document.getElementById(id);
    if(!wrapper){
        var wrapper = document.createElement('div');
        wrapper.id = id;
        wrapper.className = 'wrapper appended';
    }
    document.body.appendChild(wrapper);
    return wrapper;
};

utils.gridToHtml = function(grid){
    var node = document.createElement('table');
    var html = [];
    for(var row = 0; row < grid.length; row++){
        html.push('<tr>');
        for(var col = 0; col < grid[row].length; col++){
            html.push('<td>');
            var color = grid[row][col].toString();
            var colorStyle = 'background-color: rgba(' + color + ');';
            html.push('<div style="width: 1em;height: 1em;border: 1px solid black;' + colorStyle + '"></div>');
            html.push('<td>');
        }
        html.push('</tr>');
    }
    node.innerHTML =  html.join("\n");
    return node;
};
