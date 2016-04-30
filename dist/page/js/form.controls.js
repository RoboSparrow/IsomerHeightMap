/* global IHM */
/* global IHMui */

(function (){
    
    'use strict'; 
    
    /**
    * Default Controls
    */
    function IHMControls(prefix){
        
        var el;
        
        // Form: Select new img
        document.getElementById('IHM-Controls-image').addEventListener("change", function() {
            var image;
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                //var size = this.files[0].size;
                reader.onload = function(e) {
                    image = new Image();
                    image.src = e.target.result;
                    image.onload = function() {
                        document.getElementById('ImageSourcePreview').innerHTML = '<img src="' + image.src + '" alt="image source " />';
                        IHM.image(image);
                        IHM.render();
                    };
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        el = document.getElementById('IHM-Filter-reset');
        if(el){
            el.addEventListener("click", function(e) {
                e.preventDefault();
                IHM.reset();
                IHM.render();
            });
        }
        
        // Objects: Greyscale
        el = prefix + '-objects-greyscale';
        IHMui.controls[el] = new IHMui.controlElement(el);
        IHMui.controls[el].init(
            function(el){
                el.checked = IHM.options.objects.greyscale;
            }
        );
        IHMui.controls[el].trigger(
            function(el){
                var filter = (el.checked) ? true : false;
                IHM.display(null, {greyscale: filter});
            }
        );
        IHMui.controls[el].watch(
            function(el){
                return el.checked;
            }
        );
        
        // Objects: Invert
        el = prefix + '-objects-invert';
        IHMui.controls[el] = new IHMui.controlElement(el);
        IHMui.controls[el].init(
            function(el){
                el.checked = IHM.options.objects.invert;
            }
        );
        IHMui.controls[el].trigger(
            function(el){
                var filter = (el.checked) ? true : false;
                IHM.display(null, {invert: filter});
            }
        );
        IHMui.controls[el].watch(
            function(el){
                return el.checked;
            }
        );
    
    // Objects: Geometry
        var btns = document.querySelectorAll('#' + prefix + '-geometry button');
        
        var btnCallbackInit = function(el){
            if(el.value == IHM.options.objects.geometry){
                el.setAttribute('disabled', 'disabled');
            }else{
                el.removeAttribute('disabled');
            }
        };
        var btnCallbackTrigger = function(el, e){
            e.preventDefault();
            var btns = document.querySelectorAll('button.' + prefix + '-geometry');
            for (var k = 0; k < btns.length; k++) {
                if(btns[k].hasAttribute('disabled')){
                    btns[k].removeAttribute("disabled");
                }
            }
            el.setAttribute('disabled', 'disabled');
            var filter =  el.value;
            IHM.display(null, {geometry: filter});
        };
        
        for(var i = 0; i < btns .length; i++){
            el = btns[i].id;
            IHMui.controls[el] = new IHMui.controlElement(el);
            IHMui.controls[el].init(btnCallbackInit);
            IHMui.controls[el].trigger(btnCallbackTrigger);
        }
    
        
        // Grid: unit
        el = prefix + '-grid-unit';
        IHMui.controls[el] = new IHMui.controlElement(el);
        IHMui.controls[el].init(
            function(el){
                el.value = IHM.options.grid.unit;
            }
        );
        IHMui.controls[el].trigger(
            function(el){
                var filter = parseInt(el.value);
                IHM.render({unit: filter});
            }
        );
        IHMui.controls[el].watch(
            function(el){
                return el.value;
            }
        );
        
        // Objects: gap
        el = prefix + '-objects-gap';
        IHMui.controls[el] = new IHMui.controlElement(el);
        IHMui.controls[el].init(
            function(el){
                el.value = IHM.options.objects.gap;
            }
        );
        IHMui.controls[el].trigger(
            function(el){
                var filter = parseFloat(el.value);
                IHM.display(null, {gap: filter});
            }
        );
        IHMui.controls[el].watch(
            function(el){
                return el.value;
            }
        );
        
        // Objects: yScale
        el = prefix + '-objects-yScale';
        IHMui.controls[el] = new IHMui.controlElement(el);
        IHMui.controls[el].init(
            function(el){
                el.value = IHM.options.objects.yScale;
            }
        );
        IHMui.controls[el].trigger(
            function(el){
                var filter = parseFloat(el.value);
                IHM.display(null, {yScale: filter});
            }
        );
        IHMui.controls[el].watch(
            function(el){
                return el.value;
            }
        );
        
        
        // Objects: baseHeight
        el = prefix + '-objects-baseHeight';
        IHMui.controls[el] = new IHMui.controlElement(el);
        IHMui.controls[el].init(
            function(el){
                el.value = IHM.options.objects.baseHeight;
            }
        );
        IHMui.controls[el].trigger(
            function(el){
                var filter = parseFloat(el.value);
                IHM.display(null, {baseHeight: filter});
            }
        );
        IHMui.controls[el].watch(
            function(el){
                return el.value;
            }
        );
    }
    
    /**
    * IsomerHeightMap Controls
    */
    function IsomerControls(){
        var el;
        
        // Default controls
        IHMControls('Isomer');
    
        // Isomer: scale
        el = 'Isomer-isomer-scale';
        IHMui.controls[el] = new IHMui.controlElement(el);
        IHMui.controls[el].init(
            function(el){
                el.value = IHM.options.isomer.scale;
            }
        );
        IHMui.controls[el].trigger(
            function(el){
                var filter = parseFloat(el.value);
                IHM.display({scale: filter});
            }
        );
        IHMui.controls[el].watch(
            function(el){
                return el.value;
            }
        );
    
    }
    
    /**
    * ThreeHeightMap Controls
    */
    function ThreeControls(){
        // Default controls
        IHMControls('Three');
    }
    
    window.ThreeControls = ThreeControls;
    window.IsomerControls = IsomerControls;

}(window, document));
