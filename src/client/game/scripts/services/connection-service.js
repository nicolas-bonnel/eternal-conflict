angular.module('game').service('connectionService',['$q',function($q){
	
	var socket;
	this.connect = function(init,updateEntities,monitor){
		console.log('connecting');
		 socket = io('http://localhost:3000');
		  socket.on('connect', function(){
		  	init();
		    socket.on('entities', function(data){
		    	updateEntities(data);
		    	monitor(data);
		    });
		    socket.on('disconnect', function(){});
		  });
	};
	
	this.send = function(eventMsg,data){
		socket.emit(eventMsg,data);
	};
}]);