angular.module('eternal-conflict').controller('loginController',['$scope','$window','$location','$http','serverUrl',function($scope,$window,$location,$http,serverUrl){
	$scope.account = {
		login : '',
		password : ''
	};
	
	$scope.createAccount = function(){
		var url = serverUrl+'createAccount';
		$http.post(url,$scope.account).then(function(result){
			$window.localStorage.token = result.data.token;
			$location.path('/character/select');
		});
	};
	
	$scope.login = function(){
		$http.post(serverUrl+'login',$scope.account).then(function(result){
			$window.localStorage.token = result.data.token;
			$location.path('/character/select');
		},function(error){
			delete $window.localStorage.token;
		});
	};
	
	$scope.getAccount = function(){
		$http.get(serverUrl+'secure').then(function(result){
			$scope.account = result.data;
		});
	};
}]);
