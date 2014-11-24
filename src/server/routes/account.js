var jwt = require('jsonwebtoken');

module.exports = function(account) {
	return {
		create : function(req,res){
			account.findOne({login:req.body.login},{},function(err,result){
				if (err){
					res.sendStatus(500);
				}else if(result){
					res.sendStatus(409);
				}else{
					if(req.body.login && req.body.password){
						account.insertOne({login:req.body.login,password:req.body.password},{},function(err,result){
							var profile = {
								login: req.body.login
							};
							var token = jwt.sign(profile, 'secret', { expiresInMinutes: 60*5 });
							res.status(201).json({ token: token });
						});
					}else{
						res.sendStatus(400);
					}
				}
			});
			
		},
		login : function(req,res){
			account.findOne({login:req.body.login,password:req.body.password},{},function(err,result){
				if (err){
					res.sendStatus(500);
				}else if(result){
					var profile = {
						login: result.login
					};
					var token = jwt.sign(profile, 'secret', { expiresInMinutes: 60*5 });
					res.json({ token: token });
				}else{
					res.sendStatus(404);
				}
			});
		},
		get : function(req,res){
			account.findOne({login:req.params.account.login},{},function(err,result){
				if (err){
					res.sendStatus(500);
				}else if(result){
					res.json({login:result.login});
				}else{
					res.sendStatus(404);
				}
			});
		}
	};
};