// IsomerHeightMap v0.1.2 - Create isometric heightmaps from images. Based on jdan's excellent Isomer library.
// Copyright (c) 2014 Joerg Boeselt - https://github.com/RoboSparrow/IsomerHeightMap
// License: MIT


(function (window, document) {
    window.IHMui = window.IHMui || {};
    
    /**
     * DOM element class attribute utils
     */
    IHMui.classes = {
            toggle: function(element, name) {
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
            
            add:  function(element, name) {
                var classes = element.className.split(/\s+/);
                if(classes.indexOf(name) < 0){
                    classes.push(name);
                    element.className = classes.join(' ').trim();
                }
            },
            
            remove: function(element, name) {
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
            
            has: function(element, name){
                name = " " + name + " ";
                if ((" " + element.className + " ").replace(/[\t\r\n\f]/g, " ").indexOf(name) > -1){
                    return true;
                }
                return false;
            }
        
        };
        
    /**
     * Simple accordion
     */
    IHMui.accordion = function (accordions) {
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
    
    /**
     * Form control element events
     */
    IHMui.controlElement = function(id){
        this.element = document.getElementById(id);
        this.watchElement = document.querySelector('[for=' + id + '] .watch');
        
        this.events = {
            trigger: setTriggerEvent(this.element),
            watch: setWatchEvent(this.element, this.watchElement),
        };
        
        function setTriggerEvent(element){
            if(!element){
                return false;
            };
            switch(element.tagName.toLowerCase()){
                case 'button':
                    return 'click';
                case 'input':
                default:
                    return 'change';
            } 
        }
        
        function setWatchEvent(element, watchElement){
            if(!element){
                return false;
            };
            if(!watchElement){
                return false;
            };
            switch(element.tagName.toLowerCase()){
                case 'select':
                    return 'change';
                case 'input':
                    if (element.type.toLowerCase() == 'checkbox'){
                        return 'change';
                    }
                    if (element.type.toLowerCase() == 'radio'){
                        return 'change';
                    }
                    if (element.type.toLowerCase() == 'range'){
                        return 'change';
                    }
                    return 'keydown';
                case 'button':
                    return 'click';
                default:
                    return 'change';
            } 
        }
        
        this.init = function(callback){
            callback(this.element);
        }
          
        this.watch = function(callback){
            if(!this.events.watch){
                return;
            }
            if(!this.watchElement){
                return;
            };
            // init;
            this.watchElement.innerHTML = callback(this.element);
            // event
            var self = this;
            this.element.addEventListener(self.events.watch, function(e) {
                self.watchElement.innerHTML = callback(e.target, e);
            });
        }
        
        this.trigger = function(callback){
            if(!this.events.trigger){
                return;
            }
            var self = this;
            this.element.addEventListener(self.events.trigger, function(e) {
                callback(e.target, e);
            });
        }
    };

    
    /**
     * Init ui
     */    
    document.addEventListener("DOMContentLoaded", function(event) {
        // form controls stroage
        IHMui.controls = {};
        
        // acordion
        IHMui.accordion(document.querySelectorAll('.accordion'));
        
        // mask
        var mask = document.createElement('div');
        mask.className = 'offcanvas-mask';
        mask.addEventListener("click", function(e){// this removes any offscreen
            var nodes = document.querySelectorAll('.offcanvas.active');
            for(var i = 0; i < nodes.length; i++){
                IHMui.classes.remove(nodes[i], 'active');
            }
            e.target.parentNode.removeChild(mask);
        });
        
        // offscreen
        var toggleLinks = document.querySelectorAll('.offcanvas-toggle');
        for (var i = 0; i < toggleLinks.length; i++){
            toggleLinks[i].addEventListener("click", function(e){
                e.preventDefault();
                if(e.target.hasAttribute('href')){
                    var targ = document.getElementById(e.target.getAttribute('href').substring(1));
                }else{
                    var targ  = document.querySelector(e.target.dataset.target);
                }
                if(targ){
                    IHMui.classes.toggle(targ, 'active');
                    if(IHMui.classes.has(targ, 'active')){
                        targ.parentNode.appendChild(mask);
                    }else{
                        targ.parentNode.removeChild(mask);
                    }
                }
            });
        }
        
    });
}(this, this.document));
