ThreeHeightMap.prototype = Object.create(ImageHeightMap.prototype);
ThreeHeightMap.prototype.constructor = ImageHeightMap;

function ThreeHeightMap(element, libPath, options){
    
    ImageHeightMap.call(this, libPath, options);
    this.target = this.utils.createElement(element, 'div');
    
    this.extend('three', {
        scene: {
            width: 800,
            height: 600
        },
        objects: {
            unit: 1,
            gap: 1.3,
            baseHeight: .5,
            yScale: 1
        }
    });
    
   this.camera;
   this.controls;
   this.scene;
   this.renderer;

};

ThreeHeightMap.prototype.onRender = function() {
         // world
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2( 0x000000, 0.002 );
};

// overwrite parent render callback
ThreeHeightMap.prototype.display = function(options){
    var options = this.merge('three', options);
    
    // objects
    this.setObjects(options);
    // camera
    this.setCamera(options);
    // lights
    this.setLights(options);
    // controls
    this.setControls(options);
    // renderer
    this.setRenderer(options);
    
    // dom
    this.target.appendChild( this.renderer.domElement );
    window.addEventListener( 'resize', this.resize, false );
    
    this.renderScene();
    this.animateScene();
    
    this.fire(this.events.onDisplay);
};

ThreeHeightMap.prototype.setObjects = function(options){

    function centre(grid, objects) {
        return {
            x: (grid.length * options.objects.unit) * options.objects.gap/2,
            y: 0,
            z: (grid[0].length * options.objects.unit) * options.objects.gap/2,
        };
    };
    
    var centre = centre(this.grid, options.objects);
    
    var row = this.grid.length;
    while (row--) {
        var col = this.grid[row].length;
        
        while (col--) {
            // height    
            var height = ((3 * 255) - (this.grid[row][col][0] + this.grid[row][col][1] + this.grid[row][col][2])) / 255;
            height *= options.objects.yScale;
            // geometry
            var geometry = new THREE.BoxGeometry( 1, height + options.objects.baseHeight, 1 );
            // color
            var color = new THREE.Color(
                this.grid[row][col][0]/255,
                this.grid[row][col][1]/255,
                this.grid[row][col][2]/255
            );
            // material
            var material = new THREE.MeshLambertMaterial( { color: color } );
            // mesh
            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.set(
                -centre.x + ((col * options.objects.unit) * options.objects.gap),
                height/2, 
                -centre.z + ((row * options.objects.unit) * options.objects.gap)
            );
            // scene
            this.scene.add( mesh );
        }
    }
 
};

ThreeHeightMap.prototype.setCamera = function(options){
    this.camera = new THREE.PerspectiveCamera( 60, options.scene.width / options.scene.height, 1, 1000 );
    this.camera.position.z = -35;// rotate 180
    this.camera.position.y = 45;
    //camera.lookAt(new THREE.Vector3( 0, 0, centre.z ));
};

ThreeHeightMap.prototype.setLights = function(options){
    light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( 1, 1, 1 );
    this.scene.add( light );
    
    light = new THREE.HemisphereLight( 0xffffff, 0x333333, 0.6 );   // sky color ground color intensity
    this.scene.add( light );
};

ThreeHeightMap.prototype.setControls = function(options){
    this.controls = new THREE.TrackballControls(this.camera);
    // speed
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 2;
    this.controls.panSpeed = 0.8;
    
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;
    // keys
    this.controls.keys = [65, 83, 68];
    this.controls.addEventListener('change', this.renderScene);
};


ThreeHeightMap.prototype.setRenderer = function(options){
    this.renderer = new THREE.WebGLRenderer( { antialias: false } );
    this.renderer.setClearColor( this.scene.fog.color, 1 );
    this.renderer.setSize(options.scene.width, options.scene.height);
};

ThreeHeightMap.prototype.renderScene = function(){
    //document.querySelector('.cameraLog').innerHTML = 'camera - x: ' + this.camera.position.x.toFixed(2) + ', y: ' + this.camera.position.y.toFixed(2) + ', z: ' + this.camera.position.z.toFixed(2);
    this.renderer.render( this.scene, this.camera );
};

ThreeHeightMap.prototype.resize = function() {
    this.camera.aspect = this.options.three.scene.width / this.options.three.scene.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.options.three.scene.width, this.options.three.scene.height);
    this.controls.handleResize();
    this.renderScene();
}

ThreeHeightMap.prototype.animateScene = function() {
    requestAnimationFrame(this.animateScene);
    this.controls.update();
};
