var world = require('./world');
module.exports = function(server){
	var io = require('socket.io')(server);
	var sockets = {};
	var game = {};
	
	game.start = function(){
		
	};

	world.init(function(){
		io.on('connection', function(socket){
			console.log("Connection received");
			sockets[socket.id] = socket;
			world.players.add(socket.id);
			var area = world.players.getArea(socket.id);
			socket.emit("entities",{
	  			static:area.entities.static,
	  			ground:{
	  				heightMap : area.entities.ground,
	  				scale : area.props.scale,
	  				size : area.props.size
	  			}
	  		});
		  		
		  	socket.on('action', function(data){
		  		world.players.setAction(socket.id,data);
		
		  	});
		  	socket.on('disconnect', function(){
		  		console.log("Client disconnected");
		  		world.players.remove(socket.id);
		  		delete sockets[socket.id];
		  	});
		});
		
		setInterval(function(){
			world.update(200);
			for(var s in sockets){
				sockets[s].emit("entities",{
		  			dynamic:world.players.getArea(s).entities.dynamic,
		  			player:world.players.get(s)
		  		});
			}
		},200);
	});	

	return game;
};





