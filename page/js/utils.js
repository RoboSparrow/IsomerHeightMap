// IsomerHeightMap v0.1.1 - Create isometric heightmaps from images. Based on jdan's excellent Isomer library.
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

	/**
	* Hamburger menu
	* @see http://purecss.io/layouts/side-menu/
	*/
    var layout   = document.getElementById('layout'),
        menu     = document.getElementById('menu'),
        menuLink = document.getElementById('menuLink');

    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for(; i < length; i++) {
          if (classes[i] === className) {
            classes.splice(i, 1);
            break;
          }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    }

    menuLink.onclick = function (e) {
        var active = 'active';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    };

}(this, this.document));
