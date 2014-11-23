// IsomerHeightMap v0.1.2 - Create isometric heightmaps from images. Based on jdan's excellent Isomer library: http://jdan.github.io/isomer/
// Copyright (c) 2014 Joerg Boeselt - https://github.com/RoboSparrow/IsomerHeightMap
// License: MIT

// Cute kitten image by Ozan Kili, Creative Commons Attribution 2.0, source: http://www.freestockphotos.biz/stockphoto/9343

var IHM;

document.addEventListener("DOMContentLoaded", function(event) {
    
    //routers
    IHMui.router.register('#Home', '#ControlsForm .content', './page/templates/isomer-controls.html', '<div class="spin"></div>', function(node){
        appInit('Isomer');
        IHMui.accordion(node.querySelectorAll('.accordion'));
    });
    IHMui.router.register('#Isomer', '#ControlsForm .content', './page/templates/isomer-controls.html', '<div class="spin"></div>', function(node){
        appInit('Isomer');
        IHMui.accordion(node.querySelectorAll('.accordion'));
        
    });
    IHMui.router.register('#Three', '#ControlsForm .content', './page/templates/three-controls.html', '<div class="spin"></div>', function(node){
        appInit('Three');
        IHMui.accordion(node.querySelectorAll('.accordion'));    
    });
    
    // router init
    window.addEventListener('hashchange', IHMui.router.route); 
    IHMui.router.route();
    
    function appInit(api){
        
        var target = document.getElementById('IsomerHeightMap');
        target.innerHTML = '';

        // Init: IHM instance
        switch(api){
            case 'Three':
                IHM = new ThreeHeightMap(target);
                ThreeControls();
            break;
            
            default:
                IHM = new IsomerHeightMap(target);
                IsomerControls();
        }
        
        // Init: image
        var img = new Image();
        img.src = './page/images/cute-kitten.jpg';
        
        // Init: render
        img.onload = function() {
            document.getElementById('ImageSourcePreview').innerHTML = '<img class="pure-img" src="' + this.src + '" alt="image source" />';
            IHM.image(this);
            IHM.render();
        };

    }

});
