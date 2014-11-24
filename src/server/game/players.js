function Players(){
	this.players = {};
}

Players.prototype.add = function(id,props){
	this.players[id] = props;
};

Players.prototype.remove = function(id){
	delete this.players[id];
};

Players.prototype.setAction = function(id,action){
	this.players[id].action = action;
};

Players.prototype.update = function(delta,area){
	for (var p in this.players){
		var player = this.players[p];
		if(player.action && player.action.type == 'move'){
			
			player.speed = {
				x : 4*(player.action.position.x -  player.position.x)/1000,
				y : 4*(player.action.position.y -  player.position.y)/1000
			};
			var s = Math.sqrt(player.speed.x*player.speed.x + player.speed.y*player.speed.y);
			if(s*1000 > 20){
				player.speed.x *= (20)/(1000*s);
				player.speed.y *= (20)/(1000*s);
				player.speed.z *= (20)/(1000*s);
			}else if(s*1000 < 0.1){
				player.speed = {
					x : 0,
					y : 0
				};
				delete player.action;
			}
			
			var x = parseFloat(player.position.x)+player.speed.x*delta;
			var y = parseFloat(player.position.y)+player.speed.y*delta;
			
			player.position.x = parseFloat(x.toFixed(2));
			player.position.y = parseFloat(y.toFixed(2));
			player.position.z = area.height(player.position.x,player.position.y);
			player.speed.z = (area.height(x+player.speed.x*delta,y+player.speed.y*delta)-player.position.z)/delta;

		}
		
	}
};

module.exports = Players;