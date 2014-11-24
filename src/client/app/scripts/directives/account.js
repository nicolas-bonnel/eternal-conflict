angular.module('eternal-conflict').directive('account',[function(){
	return {
      restrict: 'E',
      replace: false,
      transclude: false,
      templateUrl: 'app/views/account.html',
      controller:'loginController',
      scope: {
      
      },
      link: function(scope,element) {
      	scope.getAccount();
      }
    };
}]);