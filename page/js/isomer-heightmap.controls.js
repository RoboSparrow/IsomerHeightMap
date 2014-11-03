// IsomerHeightMap v0.1.2 - Create isometric heightmaps from images. Based on jdan's excellent Isomer library: http://jdan.github.io/isomer/
// Copyright (c) 2014 Joerg Boeselt - https://github.com/RoboSparrow/IsomerHeightMap
// License: MIT

// Cute kitten image by Ozan Kili, Creative Commons Attribution 2.0, source: http://www.freestockphotos.biz/stockphoto/9343

var IHM;
document.addEventListener("DOMContentLoaded", function(event) {

    // Init: IHM instance
    IHM = new IsomerHeightMap('#IsomerHeightMap');

    // Init: image
    var img = new Image();
    img.src = './page/images/cute-kitten.jpg';

    // Init: render
    img.onload = function() {
        document.getElementById('ImageSourcePreview').innerHTML = '<img class="pure-img" src="' + this.src + '" alt="image source" />';
        IHM.image(this);
         IHM.render();
    };

    // Form: Select new img
    document.getElementById('IHM-Controls-image').addEventListener("change", function() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            //var size = this.files[0].size;
            reader.onload = function(e) {

                image = new Image();
                image.src = e.target.result;
                image.onload = function() {
                    document.getElementById('ImageSourcePreview').innerHTML = '<img src="' + image.src + '" alt="image source " />';
                    IHM.image(image);
                    IHM.render(n);
                };
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Objects: Greyscale
    var el = 'Isomer-objects-greyscale';
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
    var el = 'Isomer-objects-invert';
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
    var btns = document.querySelectorAll('button.isomer-geometry');

    for(var i = 0; i < btns .length; i++){
        var el = btns[i].id;
        IHMui.controls[el] = new IHMui.controlElement(el);
        IHMui.controls[el].init(
            function(el){
                if(el.value == IHM.options.objects.geometry){
                    el.setAttribute('disabled', 'disabled');
                }else{
                    el.removeAttribute('disabled');
                }
            }
        );
        IHMui.controls[el].trigger(
            function(el, e){
                e.preventDefault();
                var btns = document.querySelectorAll('button.isomer-geometry');
                for (var k = 0; k < btns.length; k++) {
                    if(btns[k].hasAttribute('disabled')){
                        btns[k].removeAttribute("disabled");
                    }
                }
                el.setAttribute('disabled', 'disabled');
                var filter =  el.value;
                IHM.display(null, {geometry: filter});
            }
        );
    }
    // Grid: unit
    var el = 'Isomer-grid-unit';
    IHMui.controls[el] = new IHMui.controlElement(el);
    IHMui.controls[el].init(
        function(el){
            el.value = IHM.options.grid.unit;
        }
    );
    IHMui.controls[el].trigger(
        function(el){
            filter = parseInt(el.value);
            IHM.render({unit: filter});
        }
    );
    IHMui.controls[el].watch(
        function(el){
            return el.value;
        }
    );
    // Objects: gap
    var el = 'Isomer-objects-gap';
    IHMui.controls[el] = new IHMui.controlElement(el);
    IHMui.controls[el].init(
        function(el){
            el.value = IHM.options.objects.gap;
        }
    );
    IHMui.controls[el].trigger(
        function(el){
            filter = parseFloat(el.value);
            IHM.display(null, {gap: filter});
        }
    );
    IHMui.controls[el].watch(
        function(el){
            return el.value;
        }
    );
    // Objects: yScale
    var el = 'Isomer-objects-yScale';
    IHMui.controls[el] = new IHMui.controlElement(el);
    IHMui.controls[el].init(
        function(el){
            el.value = IHM.options.objects.yScale;
        }
    );
    IHMui.controls[el].trigger(
        function(el){
            filter = parseFloat(el.value);
            IHM.display(null, {yScale: filter});
        }
    );
    IHMui.controls[el].watch(
        function(el){
            return el.value;
        }
    );
    // Isomer: scale
    var el = 'Isomer-isomer-scale';
    IHMui.controls[el] = new IHMui.controlElement(el);
    IHMui.controls[el].init(
        function(el){
            el.value = IHM.options.isomer.scale;
        }
    );
    IHMui.controls[el].trigger(
        function(el){
            filter = parseFloat(el.value);
            IHM.display({scale: filter});
        }
    );
    IHMui.controls[el].watch(
        function(el){
            return el.value;
        }
    );
    // Objects: baseHeight
    var el = 'Isomer-objects-baseHeight';
    IHMui.controls[el] = new IHMui.controlElement(el);
    IHMui.controls[el].init(
        function(el){
            el.value = IHM.options.objects.baseHeight;
        }
    );
    IHMui.controls[el].trigger(
        function(el){
            filter = parseFloat(el.value);
            IHM.display(null, {baseHeight: filter});
        }
    );
    IHMui.controls[el].watch(
        function(el){
            return el.value;
        }
    );
    
    var el = document.getElementById('IHM-Filter-reset');
    if(el){
        el.addEventListener("click", function(e) {
            e.preventDefault();
            IHM.reset();
            IHM.render();
        });
    }

});
