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
        var el;
        
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
    el = document.getElementById('IHM-Filter-greyscale');
    el.checked = IHM.options.shape.greyscale;
    el.addEventListener("change", function() {
        var filter = (this.checked) ? true : false;
        IHM.heightMap(null, {greyscale: filter});
    });

    // Form: Invert Mapping
    el = document.getElementById('IHM-Filter-invert');
    el.checked = IHM.options.shape.invert;
    el.addEventListener("change", function() {
        var filter = (this.checked) ? true : false;
        IHM.heightMap(null, {invert: filter}, null);
    });

    // Form: grid unit size
    el = document.getElementById('IHM-Filter-unit');
    el.value = IHM.options.grid.unit;
    el.addEventListener("mouseup", function() {
        filter = this.value;
        IHM.render({unit: filter});
    });

    // Form: yScale tile shapes
    el = document.getElementById('IHM-Filter-yScale');
    el.value = IHM.options.shape.yScale * 100;
    el.addEventListener("mouseup", function() {
        filter = this.value/100;
        IHM.heightMap(null, {yScale: filter}, null);
    });

    // Form: scale isomer
    el = document.getElementById('IHM-Filter-scale');
    el.value = IHM.options.isomer.scale;
    el.addEventListener("mouseup", function() {
        var filter = parseInt(this.value, 10);
        IHM.heightMap({scale: filter}, null);
    });

    // Form: gap
    el = document.getElementById('IHM-Filter-gap');
    el.value = IHM.options.shape.gap * 100;
    el.addEventListener("mouseup", function() {
        filter = this.value/100;
        IHM.heightMap(null, {gap: filter}, null);
    });

    // Form: shape
    els = document.querySelectorAll('#IHM-Filter-shape button');
    el =document.querySelector('button[value=' + IHM.options.shape.shape + ']');
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
            IHM.heightMap(null, {shape: filter});
        });
    }
    el.value = IHM.options.shape.shape;

    // Reset all options to default
    el = document.getElementById('IHM-Filter-reset');
    el.value = IHM.options.isomer.originY * 100;
    el.addEventListener("click", function(e) {
        e.preventDefault();
        IHM.defaults();
        IHM.render();
    });

});
