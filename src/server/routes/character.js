module.exports = function(character) {
	return {
		list : function(req, res) {
			character.find({
				login : req.params.account.login
			}).toArray(function(err, chars) {
				if (err){
					res.sendStatus(500);
				}else{
					res.json(chars);
				}
			});
		},

		create : function(req, res) {
			character.find({
				name : req.body.name
			}).toArray(function(err, chars) {
				if (err){
					res.sendStatus(500);
				}else if (chars.length) {
					res.sendStatus(409);
				} else {
					var newChar = {
						name : req.body.name,
						icon : req.body.icon,
						login : req.params.account.login
					};
					if (newChar.name && newChar.icon) {
						character.insertOne(newChar, {}, function(err, result) {
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
			character.findOne({
				name : req.params.name,
				login : req.params.account.login
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
		
		remove : function(req,res){
			character.findOneAndDelete({
				name : req.params.name,
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
