var fs = require('fs');
var mongo = require('mongodb');
var middlewares = require('../util/middlewares');

module.exports = function(app){
	fs.readFile('build/index.html','utf-8',function(err,file){
		app.get('/',function(req,res){
			res.send(file);
		});
	});
	fs.readFile('build/eternal-conflict.css','utf-8',function(err,file){
		app.get('/eternal-conflict.css',function(req,res){
			res.type('text/css').send(file);
		});
	});
	app.get('/lib/*',function(req,res){
		fs.readFile(req.originalUrl.replace('/lib/',''),'utf-8',function(err,file){
			res.type('application/javascript').send(file);
		});
	});
	
	fs.readFile('build/eternal-conflict.js','utf-8',function(err,file){
		app.get('/eternal-conflict.js',function(req,res){
			res.type('application/javascript').send(file);
		});
	});

	app.get('/data/*',function(req,res){
		fs.readFile(req.path.substring(1),null,function(err,file){
			if(err){
				res.sendStatus(404);
			}else{
				res.send(file);
			}
		});
	});
	
	mongo.connect('mongodb://localhost:27017/eternal-conflict',null,function(err,db){
		var account = require('./account')(db.collection('account'));
		var character = require('./character')(db.collection('character'));
		var map = require('./map')(db.collection('map'));
		
		app.post('/createAccount',account.create);
		app.post('/login',account.login);
		app.get('/secure', middlewares.auth, account.get);
		
		app.get('/secure/character', middlewares.auth, character.list);
		app.post('/secure/character', middlewares.auth,  character.create);
		app.get('/secure/character/:name', middlewares.auth, character.get);
		app.delete('/secure/character/:name', middlewares.auth, character.remove);
		
		app.get('/secure/map', middlewares.auth, map.list);
		app.post('/secure/map', middlewares.auth,  map.create);
		app.get('/secure/map/:id', middlewares.auth, map.get);
		app.put('/secure/map/:id', middlewares.auth, map.update);
		app.delete('/secure/map/:id', middlewares.auth, map.remove);
	});
	
	
	
};
