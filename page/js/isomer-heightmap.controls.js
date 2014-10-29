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
                    IHM.render();
                };
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Form: Greyscale
    var el = document.getElementById('IHM-Filter-greyscale');
    if(el){
        el.checked = IHM.options.objects.greyscale;
        el.addEventListener("change", function() {
            var filter = (this.checked) ? true : false;
            IHM.display(null, {greyscale: filter});
        });
    }
    
    // Form: Invert Mapping
    var el = document.getElementById('IHM-Filter-invert');
    if(el){
        el.checked = IHM.options.objects.invert;
        el.addEventListener("change", function() {
            var filter = (this.checked) ? true : false;
            IHM.display(null, {invert: filter});
        });
    }

    // Form: grid unit size
    var el = document.getElementById('IHM-Filter-unit');
    if(el){
        el.value = IHM.options.grid.unit;
        el.addEventListener("mouseup", function() {
            filter = parseInt(this.value);
            IHM.render({unit: filter});
        });
    }
    
    // Form: yScale tile objects
    var el = document.getElementById('IHM-Filter-yScale');
    if(el){
        el.value = IHM.options.objects.yScale * 100;
        el.addEventListener("mouseup", function() {
            filter = this.value/100;
            IHM.display(null, {yScale: filter});
        });
    }

    // Form: scale isomer
    var el = document.getElementById('IHM-Filter-scale');
    if(el){
        el.value = IHM.options.isomer.scale;
        el.addEventListener("mouseup", function() {
            var filter = parseInt(this.value);
            IHM.display({scale: filter});
        });
    }

    // Form: gap
    var el = document.getElementById('IHM-Filter-gap');
    if(el){
        el.value = IHM.options.objects.gap * 100;
        el.addEventListener("mouseup", function() {
            filter = this.value/100;
            IHM.display(null, {gap: filter});
        });
    }

    // Form: geometry
    var els = document.querySelectorAll('#IHM-Filter-shape button');
    var el = document.querySelector('button[value=' + IHM.options.objects.geometry + ']');
    if(el){
        el.setAttribute('disabled', 'disabled');
    }
    for (var i = 0; i < els.length; i++) {
        els[i].addEventListener("click", function(e) {
            e.preventDefault();
            for (var k = 0; k < els.length; k++) {
                if(els[k].hasAttribute('disabled')){
                    els[k].removeAttribute("disabled");
                }
            }
            this.setAttribute('disabled', 'disabled');
            var filter = this.value;
            IHM.display(null, {geometry: filter});
        });
    }

    // Form: baseHeight
    var el = document.getElementById('IHM-Filter-baseHeight');
    if(el){
        el.value = IHM.options.objects.baseHeight * 10;
        el.addEventListener("mouseup", function() {
            filter = this.value/10;
            IHM.display(null, {baseHeight: filter});
        });
    }
    
    // Reset all options to default
    if(el){
        var el = document.getElementById('IHM-Filter-reset');
        el.addEventListener("click", function(e) {
            e.preventDefault();
            IHM.reset();
            IHM.display();
        });
    }
   
});
