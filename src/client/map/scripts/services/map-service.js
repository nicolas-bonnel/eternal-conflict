angular.module('map').service('mapService',['$q','groundService','entityService',function($q,groundService,entityService){
	var that = this;
	
	this.generateForests = function(map,settings){
		var size = map.size;
		var scale = map.scale;
		var promises = [];
		console.log("generate");
		for(var j=0;j<settings.treeDensity*size*size*scale*scale/1000;j++){
			promises.push(entityService.entity('data/entities/static/tree.json').then(function(entity){
				var x = Math.random()*size*scale;
				var y = Math.random()*size*scale;
				var z = that.height(map,x,y);
				entity.addComponent(new PositionComponent(x, y, z));
				//console.log(entity.getComponent('staticMesh'));
				return entity;
			}));
		}
		return $q.all(promises);
	};
	
	this.height = function(map,x,y){
		var size = map.size;
		var scale = map.scale;
		var ground = map.ground;
		if(x>=0 && y>=0 && x<=size*scale && y<=size*scale){
			var i = Math.floor(x/scale);
			var j = Math.floor(y/scale);
			var norm;
			if(x-i+y-j>1){
				norm = triangleNormal(
					(i+1)*scale,(j+1)*scale,ground[i+1][j+1],
					(i+1)*scale,j*scale,ground[i+1][j],
					i*scale,(j+1)*scale,ground[i][j+1]
				);
			}else{
				norm = triangleNormal(
					i*scale,j*scale,ground[i][j],
					(i+1)*scale,j*scale,ground[i+1][j],
					i*scale,(j+1)*scale,ground[i][j+1]
				);
			}
			var d =  -(i*scale*norm[0]+(j+1)*scale*norm[1]+ground[i][j+1]*norm[2]);
			return -(x*norm[0]+y*norm[1]+d)/norm[2];
		}else{
			return 0;
		}
	};
	
	this.removeMeshes = function(map){
		return {
	      	size : map.size,
	      	scale : map.scale,
	      	name : map.name,
	      	ground : map.ground,
	      	thumbnail : map.thumbnail,
	      	entities : map.entities.map(function(e){
	      		var c = {};
	      		for (var comp in e._components){
	      			if(e._components[comp].mesh){
	      				c[comp.replace('$','')] = {
	      					url : e._components[comp].url
	      				};
	      			}else{
	      				c[comp.replace('$','')] = e._components[comp];
	      			}
	      		}
	      		return {
	      			components : c
	      		};
	      	})
	     };
	};
}]);

function triangleNormal(x0, y0, z0, x1, y1, z1, x2, y2, z2, output) {
  if (!output) output = [];

  var p1x = x1 - x0;
  var p1y = y1 - y0;
  var p1z = z1 - z0;

  var p2x = x2 - x0;
  var p2y = y2 - y0;
  var p2z = z2 - z0;

  var p3x = p1y * p2z - p1z * p2y;
  var p3y = p1z * p2x - p1x * p2z;
  var p3z = p1x * p2y - p1y * p2x;

  var mag = Math.sqrt(p3x * p3x + p3y * p3y + p3z * p3z);
  if (mag === 0) {
    output[0] = 0;
    output[1] = 0;
    output[2] = 0;
  } else {
    output[0] = p3x / mag;
    output[1] = p3y / mag;
    output[2] = p3z / mag;
  }

  return output;
}
