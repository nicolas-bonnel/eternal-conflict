var jwt = require('jsonwebtoken');
var ObjectID = require('mongodb').ObjectID;

module.exports = function(map) {
	return {
		list : function(req, res) {
			map.find({
				login : req.params.account.login
			}).toArray(function(err, maps) {
				if (err){
					res.sendStatus(500);
				}else{
					res.json(maps);
				}
			});
		},

		create : function(req, res) {
			map.find({
				name : req.body.name
			}).toArray(function(err, maps) {
				if (err){
					res.sendStatus(500);
				}else if (maps.length) {
					res.sendStatus(409);
				} else {
					var newMap = {
						login : req.params.account.login,
						name : req.body.name,
						size : req.body.size,
						scale : req.body.scale,
						ground : req.body.ground,
						thumbnail : req.body.thumbnail,
						entities : req.body.entities
					};
					if (newMap.name && newMap.size && newMap.scale) {
						map.insertOne(newMap, {}, function(err, result) {
							if (err){
								res.sendStatus(500);
							}else{
								res.sendStatus(201);
							}
						});
					} else {
						res.sendStatus(400);
					}
				}
			});
		},
		
		get : function(req, res){
			map.findOne({
				_id : new ObjectID(req.params.id)
			},{},function(err,result){
				if (err){
					res.sendStatus(500);
				}else if(result){
					res.json(result);
				}else{
					res.sendStatus(404);
				}
			});
		},
		
		update : function(req,res){
			var newMap = {
				login : req.params.account.login,
				name : req.body.name,
				size : req.body.size,
				scale : req.body.scale,
				ground : req.body.ground,
				thumbnail : req.body.thumbnail,
				entities : req.body.entities
			};
			map.findOneAndReplace({
				_id : new ObjectID(req.params.id),
				login : req.params.account.login
			},newMap,{},function(err,result){
				if (err){
					res.sendStatus(500);
				}else{
					res.sendStatus(200);
				}
			});
		},
		
		remove : function(req,res){
			map.findOneAndDelete({
				_id : new ObjectID(req.params.id),
				login : req.params.account.login
			},{},function(err,result){
				if (err){
					res.sendStatus(500);
				}else{
					res.sendStatus(204);
				}
			});
		}
	};
};