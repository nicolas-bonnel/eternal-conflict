var fs = require('fs');
var uuid = require('node-uuid');

var Area = require('./area');

var areas = {};


var init = function(callback){
	callback();
	/*var id = 'testArea';
	areas[id] = new Area(id);
	areas[id].props = {
		scale : ground.scale,
		size : ground.size
	};
	var g = areas[id].entities.ground;
	g.length = 0;
	for(var i in ground.heightMap){
		if(!g[i]){
			g[i] = {length:0};
			g.length ++;
		}
		for(var j in ground.heightMap[i]){
			g[i].length++;
			g[i][j] = ground.heightMap[i][j];
		}
	}
	
	fs.readFile("data/entities/creatures/antlion.json",function(err,data){
		for(var i=0;i<100;i++){
			var creature = new Creature( uuid.v4(),{url:"data/entities/creatures/antlion.json"});
			var x = Math.random()*(ground.size*ground.scale-2)+1;
			var y = Math.random()*(ground.size*ground.scale-2)+1;
			creature.set({
				position:{
					x : x,
					y : y,
					z : areas[id].height(x,y)
				},
				rotation:{
					y:Math.random()*Math.PI*2
				},
				maxSpeed : 10+Math.random()*5
			});
			areas[id].entities.dynamic.push(creature);
			if(areas[id].entities.dynamic.length>100){
				areas[id].entities.dynamic.shift();
			}
		}
	});
	fs.readFile("data/entities/static/tree.json",function(err,data){
		for(var i=0;i<100;i++){
			var x = Math.random()*(ground.size*ground.scale-2)+1;
			var y = Math.random()*(ground.size*ground.scale-2)+1;
			var entity = new Entity( uuid.v4(),{
				url:"data/entities/static/tree.json",
				position:{
					x : x,
					y : y,
					z : areas[id].height(x,y)
				},
				rotation:{
					y:Math.random()*Math.PI*2
				}
			});
			areas[id].entities.static.push(entity);
		}
		callback();
	});*/
};

var update = function(delta){
	for(var a in areas){
		areas[a].update(delta);
	}
};

var players = {};

players.add = function(id){
	areas.testArea.entities.players.add(id,{
		position : {
			x : 100,
			y : 100,
			z : areas.testArea.height(100,100)
		}
	});
	console.log('player loaded');
};

players.remove = function(id){
	areas.testArea.entities.players.remove(id);
	console.log('player loaded');
};

players.list = function(){
	return areas.testArea.entities.players.players;
};

players.get = function(id){
	return areas.testArea.entities.players.players[id];
};

players.setAction = function(id,data){
	return areas.testArea.entities.players.setAction(id,data);
};

players.getArea = function(id){
	return areas.testArea;
};

module.exports = {
	update : update,
	init : init,
	players : players
};