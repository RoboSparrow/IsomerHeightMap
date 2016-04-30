// IsomerHeightMap v0.1.2 - Create isometric heightmaps from images. Based on jdan's excellent Isomer library.
// Copyright (c) 2014 Joerg Boeselt - https://github.com/RoboSparrow/IsomerHeightMap
// License: MIT


(function () {
    var IHMui = {};
    
    /**
     * DOM element class manipulation
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
      * Primitive accordion
     */
    var accordion = function(){
        var acc = document.querySelectorAll('.accordion-hl');
        for (var k = 0; k < acc.length; k++) {
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
    };
    
    IHMui.accordion = function (accordions) {
        for (var i = 0; i < accordions.length; i++) {
            var hl = accordions[i].querySelector('.accordion-hl');
            hl.insertAdjacentHTML('afterbegin', '<span class="indicator"><span></span></span> ');
            hl.addEventListener('click', accordion, false);
        }
    };
    
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
            var state = false;
            if(!element){
                state = false;
            }
            switch(element.tagName.toLowerCase()){ 
                case 'button':
                    state = 'click';
                break;
                case 'input':
                    state = 'change';
                break;
                default:
                    state = 'change';
            } 
            return state;
        }
        
        function setWatchEvent(element, watchElement){
            var state = false;
            if(!element){
                state = false;
            }
            if(!watchElement){
                state = false;
            }
            
            switch(element.tagName.toLowerCase()){
                case 'select':
                    state = 'change';
                break;
                case 'input':
                    if (element.type.toLowerCase() == 'checkbox'){
                        state = 'change';
                    }
                    if (element.type.toLowerCase() == 'radio'){
                        state = 'change';
                    }
                    if (element.type.toLowerCase() == 'range'){
                        state = 'change';
                    }
                    state = 'keydown';
                break;
                case 'button':
                    state = 'click';
                break;
                default:
                    state = 'change';
            } 
            return state;
        }
        
        this.init = function(callback){
            callback(this.element);
        };
          
        this.watch = function(callback){
            if(!this.events.watch){
                return;
            }
            if(!this.watchElement){
                return;
            }
            // init;
            this.watchElement.innerHTML = callback(this.element);
            // event
            var self = this;
            this.element.addEventListener(self.events.watch, function(e) {
                self.watchElement.innerHTML = callback(e.target, e);
            });
        };
        
        this.trigger = function(callback){
            if(!this.events.trigger){
                return;
            }
            var self = this;
            this.element.addEventListener(self.events.trigger, function(e) {
                callback(e.target, e);
            });
        };
    };
    
    /**
     * Simple Router
     * inspired by http://joakimbeng.eu01.aws.af.cm/a-javascript-router-in-20-lines/
     */
    IHMui.router = {};
    IHMui.router.items = {};
        
    IHMui.router.register = function(hash, wrapper, template, preloader, controller){
        wrapper = wrapper  || document.body;
        wrapper = (typeof wrapper === 'string') ? document.querySelector(wrapper) : wrapper;
        template = template || null;
        preloader = preloader || null;
        if(wrapper){
            this.items[hash] = {
                wrapper: wrapper,
                template: template,
                controller: controller || function(){},
                preloader: preloader
            };
        }
    };
    
    IHMui.router.route = function(){
        var hash = location.hash;
        if(!hash || hash == '#'){
            hash = '#Home';
        }
        if(!IHMui.router.items.hasOwnProperty(hash)){
            return false;
        }
        var item = IHMui.router.items[hash];
        if(item.preloader){
            item.wrapper.innerHTML = item.preloader;
        }
        IHMui.router.load(item.template, function(html){
            item.wrapper.innerHTML = html;
            item.controller(item.wrapper);
        });
    };
    
    IHMui.router.load = function(template, callback){
        var xhr = new XMLHttpRequest();
        callback = callback || function(){};
        xhr.open('GET', template);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4){
                if(xhr.status == 200 || xhr.status == 304){
                    callback(xhr.responseText);
                }
            }
        };
        xhr.send();
    };


    /**
     * Init
     */    
    document.addEventListener("DOMContentLoaded", function() {
        
        // form controls storage
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
        var toggle = function(el){
            el.addEventListener("click", function(e){
                var targ;
                e.preventDefault();
                if(e.target.hasAttribute('href')){
                    targ = document.getElementById(e.target.getAttribute('href').substring(1));
                }else{
                    targ  = document.querySelector(e.target.dataset.target);
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
        };
        var toggleLinks = document.querySelectorAll('.offcanvas-toggle');
        for (var i = 0; i < toggleLinks.length; i++){
            toggle(toggleLinks[i]);
        }

    });
    
    window.IHMui = IHMui;
    
}(window, document));
