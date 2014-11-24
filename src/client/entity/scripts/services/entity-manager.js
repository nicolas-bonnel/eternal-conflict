angular.module('entity').service('entityManagerService',['entityService','groundService', function(entityService,groundService){
	var creatures = {};
	var ground = {};
	var staticEntities = {};
	var map;
	var player = {};
	
	this.update = function(delta){
		for(var i in creatures){
			if(creatures[i].update && creatures[i].speed){
				creatures[i].update({
					position:{
						x:creatures[i].position.x+creatures[i].speed.x*delta,
						z:creatures[i].position.z+creatures[i].speed.y*delta,
						y:creatures[i].position.y+creatures[i].speed.z*delta
					}
				});
				creatures[i].animate(7);
			}
		}
		if(player.position && player.speed){
			player.position.x +=player.speed.x*delta;
			player.position.y +=player.speed.y*delta;
			player.position.z +=player.speed.z*delta;
		}
	};
	
	
	var update = {};
	update.static = function(data,scene){
		for(var e in staticEntities){
			staticEntities[e].present = false;
		}
		var cpt = 0;
		var entities = data;
		for(var i in entities){
			(function(entityServer){
				var t = entityServer.position.z;
				entityServer.position.z = entityServer.position.y;
				entityServer.position.y = t;
				if(!staticEntities[entityServer.id]){
					staticEntities[entityServer.id] = {
						present : true
					};
					entityService.staticEntity(entityServer.url).then(function(entityClient){
						if(!staticEntities[entityServer.id] || !staticEntities[entityServer.id].mesh){
							entityClient.mesh.entitie = entityServer;
							scene.add(entityClient.mesh);
							entityClient.update(entityServer);
							staticEntities[entityServer.id] = entityClient;
							entityClient.present = true;
						}
					});
					
				}else{
					if(staticEntities[entityServer.id].mesh){
						staticEntities[entityServer.id].present = true;
						cpt ++;
					}
				}
			})(entities[i]);
		}
		
		for(var e in staticEntities){
			if(!staticEntities[e].present){
				scene.remove(staticEntities[e].mesh);
				delete staticEntities[e];
			}

		}
	};

	update.ground = function(data,scene){
		ground = data;
		var newMap = groundService.mesh(data);
		scene.add(newMap);
		// map
		if(map){
			scene.remove(map);
		}
		map = newMap;
	};
	
	update.player = function(data,scene){
		player = data;
	};
	
	update.dynamic = function(data,scene){
		for(var c in creatures){
			creatures[c].present = false;
		}
		var cpt = 0;
		for(var i in data){
			(function(creatureServer){
				var t = creatureServer.position.z;
				creatureServer.position.z = creatureServer.position.y;
				creatureServer.position.y = t;
				if(!creatures[creatureServer.id]){
					creatures[creatureServer.id] = {
						present : true
					};
					entityService.creature(creatureServer.url).then(function(creatureClient){
						if(!creatures[creatureServer.id] || !creatures[creatureServer.id].mesh){
							creatureClient.mesh.entitie = creatureServer;
							scene.add(creatureClient.mesh);
							creatureClient.update(creatureServer);
							creatures[creatureServer.id] = creatureClient;
							creatureClient.present = true;
						}
					});
					
				}else{
					if(creatures[creatureServer.id].update){
						creatures[creatureServer.id].update(creatureServer);
						creatures[creatureServer.id].present = true;
						cpt ++;
					}
				}
			})(data[i]);
		}
		
		for(var c in creatures){
			if(!creatures[c].present){
				scene.remove(creatures[c].mesh);
				delete creatures[c];
			}
		}
	};
	
	this.updateEntities = function(scene){
		return function(data){
			for (var d in data){
				update[d](data[d],scene);
			}
		};
	};
	
	this.getPlayer = function(){
		return player;
	};
	
	this.getGround = function(){
		return ground;
	};
	
}]);
