/* global ThreeHeightMap */
/* global IsomerHeightMap */
/* global IHMui */
/* global ThreeControls */
/* global IsomerControls */

// Cute kitten image by Ozan Kili, Creative Commons Attribution 2.0, source: http://www.freestockphotos.biz/stockphoto/9343

var IHM;

document.addEventListener("DOMContentLoaded", function() {
    
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
