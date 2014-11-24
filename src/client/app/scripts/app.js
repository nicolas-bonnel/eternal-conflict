var app = angular.module('eternal-conflict',[
	'ngMaterial',
	'ngRoute',
	'models',
	'game',
	'map'
]);

app.factory('authInterceptor', function ($q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.localStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

app.config(function ($routeProvider,$httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
    $routeProvider
      .when('/loader', {
        templateUrl: 'app/views/loader.html'
      }).when('/', {
      	controller: 'loginController',
        templateUrl: 'app/views/login.html'
      }).when('/character/select', {
      	controller: 'characterSelectController',
        templateUrl: 'app/views/character-select.html'
      }).when('/character/create', {
      	controller: 'characterCreateController',
        templateUrl: 'app/views/character-create.html'
      })
      .when('/game/:character', {
        templateUrl: 'app/views/game.html'
      }).when('/map', {
      	controller: 'mapListController',
        templateUrl: 'map/views/map-list.html'
      }).when('/map/new', {
      	controller: 'mapEditController',
        templateUrl: 'map/views/map-edit.html'
      }).when('/map/:mapId', {
      	controller: 'mapEditController',
        templateUrl: 'map/views/map-edit.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  
app.constant('serverUrl','http://localhost:3000/');

