angular.module('game').directive('game',['entityManagerService', 'connectionService', function(entityManagerService,connectionService){
	return {
      restrict: 'E',
      replace: false,
      transclude: false,
      templateUrl: 'game/views/game.html',
      scope: {
      	width:"=",
      	height:"="
      },
      link: function(scope,element) {
      	var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(50, scope.width/scope.height, 0.1, 1000);
		var renderer = new THREE.WebGLRenderer();
		renderer.setSize(scope.width,scope.height);
		element.append(renderer.domElement);
	    renderer.setClearColorHex(0x000000, 1);
		
		var init = function(){
			
		};
		
		var packets = [];
		var monitor = function(data){
			time = new Date().getTime();
			packets.push({size:JSON.stringify(data).length,date:new Date().getTime()});
			while(time-packets[0].date>1000){
				packets.shift();
			}
			var avg = 0;
			packets.forEach(function(p){
				avg += p.size;
			});
			if(packets.length>1)
			scope.bandwidth = avg/(packets[packets.length-1].date-packets[0].date);
		};
		
		connectionService.connect(
			init,
			entityManagerService.updateEntities(scene),
			monitor
		);

				

		  element.on('mousedown', function(event) {
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
			    	connectionService.send('action',{
			    		type:'move',
			    		position:{
				    		x:intersects[0].point.x,
				    		y:intersects[0].point.z,
				    		z:intersects[0].point.y
				    	}
				    });
			    }
			});
		
		
		
		
		camera.rotation.x -= Math.PI/3;

	    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
		directionalLight.position.set( 1, 1, 1 );
		scene.add( directionalLight );
		render();
		

		var lastUpdate = new Date().getTime();
		 function render() {
		 	//camera.rotation.x-=0.001;
		 	//camera.rotation.z+=0.001;
		 	var time = new Date().getTime();
		 	var delta = time - lastUpdate;
			entityManagerService.update(delta);
			lastUpdate = time;
			requestAnimationFrame(render);
			renderer.clear();
			
			var player = entityManagerService.getPlayer();
			if(player && player.position){
				var h = 100 + player.position.z;
				camera.position.x = player.position.x;
				camera.position.z = player.position.y+h*0.6;
				camera.position.y = h;
			}
			renderer.render(scene, camera);
		};
		
		
      }
    };
}]);