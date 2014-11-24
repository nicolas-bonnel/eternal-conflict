angular.module('map').directive('mapView',['$timeout', 'mapService',function($timeout, mapService){
	return {
      restrict: 'E',
      replace: false,
      transclude: false,
      templateUrl: 'map/views/map-view.html',
      scope: {
      	width:"=",
      	height:"=",
      	map:"=",
      	thumbnail:"="
      },
      link: function(scope,element) {
      	var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(70, scope.width/scope.height, 0.1, 10000);
		var renderer = new THREE.WebGLRenderer({
		    preserveDrawingBuffer: true 
		});
		renderer.setSize(scope.width,scope.height);
		
		element.find('#view').append(renderer.domElement);
	    renderer.setClearColorHex(0x000000, 1);
		
		var zoom = 1;
		
		element.find('#view').on('mousewheel', function(event) {
			zoom = zoom - event.originalEvent.wheelDelta/5000;
			updateCamera();
		});				

		  element.find('#view').on('mousedown', function(event) {
			var projector = new THREE.Projector();
			
			    event.preventDefault();
			
			    var vector = new THREE.Vector3(
			        ( event.pageX  / scope.width ) * 2 - 1,
			      - ( event.pageY  / scope.height ) * 2 + 1,
			        0.5
			    );
			    projector.unprojectVector( vector, camera );
			
			    var ray = new THREE.Raycaster( camera.position, 
			                             vector.sub( camera.position ).normalize() );
			
			    var intersects = ray.intersectObjects( scene.children ,true);
			   
			
			    if ( intersects.length > 0 ) {
			    	var point = intersects[0].point;
			    	updateCamera(point.x,point.z);
		   		 }
			});
				
						
	    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
		directionalLight.position.set( -1, 1, -1 );
		scene.add( directionalLight );
		
		var water;
		// World containing entities
		var world = new CES.World();
		world.entityAdded('waterMesh').add(function(entity) {
	    	scene.add(entity.getComponent('waterMesh').mesh);
	    });
	    world.entityRemoved('waterMesh').add(function(entity) {
	    	scene.remove(entity.getComponent('waterMesh').mesh);
	    });
	    world.entityAdded('staticMesh').add(function(entity) {
	    	scene.add(entity.getComponent('staticMesh').mesh);
	    });
	    world.entityRemoved('staticMesh').add(function(entity) {
	    	scene.remove(entity.getComponent('staticMesh').mesh);
	    });
	    world.entityAdded('animatedMesh').add(function(entity) {
	    	scene.add(entity.getComponent('animatedMesh').mesh);
	    });
	    world.entityRemoved('animatedMesh').add(function(entity) {
	    	scene.remove(entity.getComponent('animatedMesh').mesh);
	    });
	    // Systems
	    world.addSystem(new WaterSystem());
	 //   world.addSystem(new LocateMeshSystem());
	 
	    scope.stats = {};
		render();
        		
        		

		var lastUpdate = new Date().getTime();
		 function render() {
		 	var time = new Date().getTime();
		 	var delta = time - lastUpdate;
		 	$timeout(function() {
			 	scope.stats.fps = parseInt(1000 / delta);
			 	scope.stats.vertices = scene.children.filter(function(o){
			 		return o.visible && o.geometry;
			 	}).reduce(
		           function(prev,current){
		             return  current.geometry.vertices.length + prev;
		           }, 0
		         );
		         scope.stats.faces = scene.children.filter(function(o){
			 		return o.visible && o.geometry;
			 	}).reduce(
		           function(prev,current){
		             return current.geometry.faces.length + prev;
		           }, 0
		         );
	       });
			lastUpdate = time;
			requestAnimationFrame(render);
			renderer.clear();
			world.update(delta);
			renderer.render(scene, camera);
		};
		
		
		
		
		
		scope.$watch('map',function(newMap, oldMap){
			if(oldMap){
				console.log('removing old map from scene');
				scene.remove(oldMap.groundMesh);
				if(oldMap.entities)
					oldMap.entities.forEach(function(e){
						world.removeEntity(e);
					});
				world.removeEntity(water);
			}
			if(newMap){
				console.log('adding new map to scene',newMap);
				scene.add(newMap.groundMesh);
				if(newMap.entities)
					newMap.entities.forEach(function(e){
						world.addEntity(e);
					});
				water = new CES.Entity();
				water.addComponent(new WaterMeshComponent(newMap.size*newMap.scale, newMap.size*newMap.scale,renderer, camera, scene, directionalLight));
				world.addEntity(water);
				
				var entities = world.getEntities('position','staticMesh');
		        var position, mesh;
		        entities.forEach(function (entity) {
		            position = entity.getComponent('position');
		            mesh = entity.getComponent('staticMesh').mesh;
		            mesh.position.x = position.x;
		            mesh.position.y = position.z;
		            mesh.position.z = position.y;
		        });
        
				var mid = newMap.size*newMap.scale/3;
				updateCamera(mid,mid);
			}
		});
		
		
		function updateCamera(x,y){
			var h = scope.map.size*scope.map.scale*zoom;
			if(x && y){
				var z = mapService.height(scope.map,x,y);
				camera.target = {
					x : x,
					z : y,
					y : z
				};
			}
			camera.position.x = camera.target.x-h/2;
			camera.position.z = camera.target.z-h/2;
			camera.position.y = camera.target.y+h;
			camera.lookAt(camera.target);
					
			resizeImage(renderer.domElement.toDataURL("image/png"),120,90,function(imgUrl){
				scope.thumbnail = imgUrl;
				scope.$apply();
			});
		};
		
		function resizeImage(url, width, height, callback) {
		    var sourceImage = new Image();
		    sourceImage.onload = function() {
		        // Create a canvas with the desired dimensions
		        var canvas = document.createElement("canvas");
		        canvas.width = width;
		        canvas.height = height;
		
		        // Scale and draw the source image to the canvas
		        canvas.getContext("2d").drawImage(sourceImage, 0, 0, width, height);
		
		        // Convert the canvas to a data URL in PNG format
		        callback(canvas.toDataURL());
		    };
		
		    sourceImage.src = url;
		};
				
		
      }
    };
}]);