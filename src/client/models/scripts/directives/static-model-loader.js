angular.module('models').directive('staticModelLoader',['modelService',function(modelService){
	return {
      restrict: 'E',
      replace: false,
      transclude: false,
      templateUrl: 'models/static-model-loader.html',
      scope: {
      	modelUrl : "=",
      	width:"=",
      	height:"="
      },
      link: function(scope,element) {
      	var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(75, scope.width/scope.height, 0.1, 1000);
		camera.position.z = 20;
				
      	var renderer = new THREE.WebGLRenderer();
		renderer.setSize(scope.width,scope.height);
		element.append(renderer.domElement);
	    renderer.setClearColorHex(0x666666, 1);


		
		
		var light = new THREE.PointLight(0xffffff);
	    light.position.set(0,100,50);
	    scene.add(light);
		
		var _mesh ;
		
		modelService.staticMesh(scope.modelUrl).then(function(mesh){
			scene.add(mesh);
			render(mesh);
			_mesh = mesh;
		});
		
		
		 function render() {
			requestAnimationFrame(render);
			if(_mesh){
			    _mesh.rotation.y += -0.01;
			}
			renderer.clear();
			renderer.render(scene, camera);
		};
		
		
      }
    };
}]);