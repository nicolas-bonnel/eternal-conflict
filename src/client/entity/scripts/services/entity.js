angular.module('entity').service('entityService',['modelService', '$http', '$q', function(modelService,$http,$q){
	var cache = {};
	
	this.entity = function(entityUrl){
		if(!cache[entityUrl]){
			cache[entityUrl] = $http.get(entityUrl);
		}
		return cache[entityUrl].then(function(response){
			var e = response.data;
			if(e.resolve){
				if (e.resolve.staticMesh){
					return modelService.staticMesh(e.resolve.staticMesh).then(function(mesh){
						var ent = new CES.Entity();
						ent.addComponent(mesh);
						return ent;
					});
				}
			}
			
		});
	};
	
	this.parseEntity = function(entity){
		var c = entity.components;
		var ent = new CES.Entity();
		var promises = {};
		if(c.position){
			ent.addComponent(new PositionComponent(c.position.x, c.position.y, c.position.z));
		}
		if(c.staticMesh){
			promises.staticMesh = modelService.staticMesh(c.staticMesh.url);
		}
		if(Object.keys(promises).length){
			return $q.all(promises).then(function(components){
				for(comp in components){
					ent.addComponent(components[comp]);
				};
				return ent;
			});
		}else{
			return $q.when(ent);
		}
	};
}]);
