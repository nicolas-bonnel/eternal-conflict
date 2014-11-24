angular.module('models').directive('animatedModelLoader',['modelService',function(modelService){
	return {
      restrict: 'E',
      replace: false,
      transclude: false,
      templateUrl: 'models/animated-model-loader.html',
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
		
		modelService.animatedMesh(scope.modelUrl).then(function(mesh){
			scene.add(mesh);
			scope.currentAnimation = mesh.geometry.firstAnimation;
 			scope.animations = {};
 			
 			for (var anim in mesh.geometry.animations){
 				scope.animations[anim] = mesh.geometry.animations[anim];
 			}
 			
			render(mesh);
			
			scope.$watch('currentAnimation',function(newVal){
				if(newVal){
				 	mesh.playAnimation(newVal,3);
				}
			});
			
			_mesh = mesh;
		});
		
		
		 function render() {
			requestAnimationFrame(render);
			if(_mesh){
			    _mesh.rotation.y += -0.01;
				_mesh.updateAnimation(10);
			}
			renderer.clear();
			renderer.render(scene, camera);
		};
		
		
      }
    };
}]);