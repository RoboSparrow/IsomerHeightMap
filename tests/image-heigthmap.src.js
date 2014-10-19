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
