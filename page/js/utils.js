// IsomerHeightMap v0.1.2 - Create isometric heightmaps from images. Based on jdan's excellent Isomer library.
// Copyright (c) 2014 Joerg Boeselt - https://github.com/RoboSparrow/IsomerHeightMap
// License: MIT


(function (window, document) {

     /**
      * Primitive accordion
     */
    function makeAccordion(accordions) {
        for (i = 0; i < accordions.length; i++) {
            var hl = accordions[i].querySelector('.accordion-hl');
            hl.insertAdjacentHTML('afterbegin', '<span class="indicator"><span></span></span> ');
            hl.addEventListener('click', function() {
                var acc = document.querySelectorAll('.accordion-hl');
                for (k = 0; k < acc.length; k++) {
                    if(acc[k].isEqualNode(this)){
                        if(this.parentNode.className.indexOf('active') > 0 ){
                            this.parentNode.className = 'accordion';
                        }else{
                            this.parentNode.className = 'accordion active';
                        }
                        continue;
                    }
                    acc[k].parentNode.className = 'accordion';
                }
            }, false);
        }
    }
    var accordions = document.querySelectorAll('.accordion');
    makeAccordion(accordions);


    var IHMUtils = {
            toggleClass: function(element, name) {
                var classes = element.className.split(/\s+/);
                var length = classes.length;
                for(var i = 0; i < length; i++) {
                if (classes[i] === name) {
                    classes.splice(i, 1);
                    break;
                }
                }
                if (length === classes.length) {
                    classes.push(name);
                }
                element.className = classes.join(' ').trim();
            },
            
            addClass:  function(element, name) {
                var classes = element.className.split(/\s+/);
                if(classes.indexOf(name) < 0){
                    classes.push(name);
                    element.className = classes.join(' ').trim();
                }
            },
            
            removeClass: function(element, name) {
                var classes = element.className.split(/\s+/); 
                if(classes.indexOf(name) >= 0){
                    for(var i = 0; i < classes.length; i++) {
                        if (classes[i] === name) {
                            classes.splice(i, 1);
                            break;
                        }
                    }
                    element.className = classes.join(' ').trim();
                }
            },
            
            hasClass: function(element, name){
                name = " " + name + " ";
                if ((" " + element.className + " ").replace(/[\t\r\n\f]/g, " ").indexOf(name) > -1){
                    return true;
                }
                return false;
            }
        
        };
 document.addEventListener("DOMContentLoaded", function(event) {
    var toggleLinks = document.querySelectorAll('.offcanvas-toggle');
    for (var i = 0; i < toggleLinks.length; i++){
        toggleLinks[i].addEventListener("click", function(e){
            e.preventDefault();
            if(e.target.hasAttribute('href')){
                var targ = document.getElementById(e.target.getAttribute('href').substring(1));
            }else{
                var targ  = document.querySelector(e.target.dataset.target);
            }console.log(targ);
            if(targ){
                IHMUtils.toggleClass(targ, 'active');
            }
        });
    }
    
    var closeLinks = document.querySelectorAll('.offcanvas-close-parent');
    for (var i = 0; i < closeLinks.length; i++){
        closeLinks[i].addEventListener("click", function(e){
            e.preventDefault();
            var targ = e.target.parentNode;
            if(targ){
                IHMUtils.removeClass(targ, 'active');
            }
        });
    }
});
}(this, this.document));
