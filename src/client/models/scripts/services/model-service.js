angular.module('models').service('modelService',['$q',function($q){
	var that = this;
	var loader = new THREE.JSONLoader;
	var models = {};
	
	this.load = function(modelUrl){
		var deferred = $q.defer();
		loader.load(modelUrl, function (geometry, materials) {
			models[modelUrl] = {
				geometry : geometry,
				materials : materials
			};
			deferred.resolve();
		});
		return deferred.promise; 
	};
	
	this.animatedMesh = function(modelUrl){
		if(!models[modelUrl]){
			return that.load(modelUrl).then(function(){
				return that.animatedMesh(modelUrl);
			});
		}else{
			return $q.when(new AnimatedMeshComponent(models[modelUrl].geometry,models[modelUrl].materials,modelUrl));
		}
	};
	
	this.staticMesh = function(modelUrl){
		if(!models[modelUrl]){
			return that.load(modelUrl).then(function(){
				return that.staticMesh(modelUrl);
			});
		}else{
			return $q.when(new StaticMeshComponent(models[modelUrl].geometry,models[modelUrl].materials,modelUrl)); 
		}
	};
	
}]);
