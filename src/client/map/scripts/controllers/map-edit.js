angular.module('map').controller('mapEditController', ['$scope', '$http', '$q', '$routeParams', '$mdDialog', '$mdToast','entityService','groundService', 'mapService', 'serverUrl',
function($scope, $http, $q, $routeParams, $mdDialog, $mdToast, entityService, groundService, mapService, serverUrl) {
	// TODO get the map if map Id
	$scope.settings = {
		size : 64,
		scale : 20,
		mountains : 0.5,
		treeDensity : 0.5,
		numForest : 100
	};

	$scope.mapId = $routeParams.mapId;
	if ($scope.mapId) {
		$http.get(serverUrl + 'secure/map/' + $scope.mapId).then(function(result) {
			var m = result.data;
			var entityPromises = m.entities.map(function (e){
				return entityService.parseEntity(e);
			});
			$q.all(entityPromises).then(function(entities){
				$scope.map = {
					size : m.size,
			      	scale : m.scale,
			      	name : m.name,
			      	ground : m.ground,
			      	groundMesh : groundService.mesh(m.ground, m.scale),
			      	thumbnail : m.thumbnail,
			      	entities : entities
				};
			});
		});
	}

	$scope.save = function() {
		$http.put(serverUrl + 'secure/map/' + $scope.mapId, mapService.removeMeshes($scope.map)).then(function(result) {
			$mdToast.show($mdToast.simple().content('Map saved'));
		});
	};

	$scope.create = function(ev) {
		$mdDialog.show({
			controller : DialogController,
			templateUrl : 'map/views/map-name-dialog.html',
			targetEvent : ev
		}).then(function(answer) {
			if (answer) {
				var newMap = mapService.removeMeshes($scope.map);
				newMap.name = answer;
				$http.post(serverUrl + 'secure/map', newMap).then(function(result) {
					$mdToast.show($mdToast.simple().content('Map saved'));
				});
			}

		});

	};

	$scope.generate = function() {
		var ground = groundService.generate($scope.settings.size, $scope.settings.scale, $scope.settings.mountains);
		var groundMesh = groundService.mesh(ground, $scope.settings.scale);
		var map = {
			size : $scope.settings.size,
			scale : $scope.settings.scale,
			ground : ground,
			groundMesh : groundMesh,
			name : $scope.map && $scope.map.name,
			entities:[]
		};
		$q.all({
			trees : mapService.generateForests(map, $scope.settings)
		}).then(function(res) {
			res.trees.forEach(function(t){
				if (t.getComponent('position').z>5)
					map.entities.push(t);
			});
			$scope.map = map;
		});
	};
}]);

function DialogController($scope, $mdDialog) {
	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
}

