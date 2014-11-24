angular.module('eternal-conflict').controller('characterCreateController',['$scope','$window','$location','$http','serverUrl',function($scope,$window,$location,$http,serverUrl){
	$http.get(serverUrl+'data/resources/character-icons.json').then(function(result){
		$scope.icons = result.data;
	},function(error){
	});
	
	$scope.character = {};
	
	$scope.create = function(){
		$http.post(serverUrl+'secure/character',$scope.character).then(
			function(success){
				$location.path('game/'+$scope.character.name);
			}
		);
		
	};
}]);
