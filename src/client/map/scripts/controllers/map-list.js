angular.module('map').controller('mapListController', ['$scope', '$http', 'serverUrl',
function($scope, $http, serverUrl) {
	$http.get(serverUrl+'secure/map').then(function(result){
		$scope.maps = result.data;
		console.log(result.data);
	});
}]);
