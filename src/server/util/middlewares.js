var jwt = require('jsonwebtoken');

module.exports = {
	auth : function(req, res, next) {
		if (req.headers && req.headers.authorization) {
			var auth = req.headers.authorization;
			var toks = auth.split('Bearer ');
			if (toks.length === 2) {
				jwt.verify(toks[1], 'secret', function(err, account) {
					if (err || !account) res.sendStatus(403);
					req.params.account = account;
					next();
				});
			} else {
				res.sendStatus(401);
			}
		} else {
			res.sendStatus(401);
		}
	}
};

