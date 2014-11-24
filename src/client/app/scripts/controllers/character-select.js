angular.module('eternal-conflict').controller('characterSelectController',['$scope','$window','$location','$http','serverUrl',function($scope,$window,$location,$http,serverUrl){
	$http.get(serverUrl+'data/resources/character-icons.json').then(function(result){
		$scope.icons = result.data;
	},function(error){
	});
	
	$http.get(serverUrl+'secure/character').then(function(result){
		$scope.characters = result.data;
		console.log(result.data);
	},function(error){
	});
	
	$scope.play = function(name){
		$location.path('game/'+name);
	};
	
	$scope.create = function(){
		$location.path('character/create');
	};
}]);
