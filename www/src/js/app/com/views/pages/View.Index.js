

APP.Views = APP.Views || {};


APP.Views.Index = (function(window){
	
	
	function Index() {
		APP.View.call(this);
	}
	
	
	Index.prototype = Object.create(APP.View.prototype);
	Index.prototype.constructor = Index;
	
	
	Index.prototype.initElt = function() {
		this.$.page = $(document.getElementById('page-content'));
		this.$.sceneContainer = $(document.getElementById('scene-container'));
		
		_initScene.call(this);
		
	//	TweenLite.ticker.addEventListener('tick', _render, this);
	};
	
	
	Index.prototype.bindEvents = function() {
		this.resizeWindowProxy = $.proxy(_resize, this);
		APP.Main.$.window.on('resize', this.resizeWindowProxy);
	};
	
	
	Index.prototype.unbindEvents = function() {
		
	};
	
	
	var _resize = function() {
		APP.Main.resize();
		
		this.camera.aspect = APP.Main.windowW/APP.Main.windowH;
		this.camera.updateProjectionMatrix();
		
		this.renderer.setSize(APP.Main.windowW, APP.Main.windowH);
	};
	
	
	var _initScene = function() {
		this.scene = new THREE.Scene();
		
		this.camera = new THREE.PerspectiveCamera(50, APP.Main.windowW/APP.Main.windowH, 1, 20000);
		this.camera.position.set(0, 30, 250);
		
		this.renderer = new THREE.WebGLRenderer({antialias:true});
		this.renderer.setSize(APP.Main.windowW, APP.Main.windowH);
		this.renderer.setClearColor(0xcccccc);
		this.$.sceneContainer[0].appendChild(this.renderer.domElement);
		
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
		this.directionalLight.position.set(-100, 40, 20);
		this.scene.add(this.directionalLight);
		
		this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 1);
		this.scene.add(this.hemisphereLight);
		
		_initObject.call(this);
	};
	
	
	var _initObject = function() {
		var loader = new THREE.JSONLoader();
		
		loader.load(APP.Config.JS_3D_MODELS+'car.js', _objectLoaded.bind(this));
	};
	
	
	var _objectLoaded = function(geometry) {
		var material = new THREE.MeshLambertMaterial({
			map : THREE.ImageUtils.loadTexture(APP.Config.JS_3D_MODELS+'textures/gtare.jpg')
		});
		
		this.mesh = new THREE.Mesh(geometry, material);
		console.log(this.mesh);
		
		this.mesh.rotation.set(0.2, -45*Math.PI/180, 0);
		
		this.scene.add(this.mesh);
		
		
		TweenLite.ticker.addEventListener('tick', _render, this);
	};
	
	
	var _render = function() {
		APP.Main.stats.begin();
		
		this.mesh.rotation.y -= 0.005;
		
		this.renderer.render(this.scene, this.camera);
		
		APP.Main.stats.end();
	};
	
	
	return new Index();
	
	
})(window);

