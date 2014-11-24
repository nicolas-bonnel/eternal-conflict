var Players = require('./players');

function Area(id){
    this.id = id;
    this.entities = {
    	dynamic : [],
    	static:[],
    	ground : {},
    	players : new Players()
    };
    this.props = {};
}

Area.prototype.update = function(delta){
	for(var i in this.entities.dynamic){
		this.entities.dynamic[i].update(delta,this);
	}
	this.entities.players.update(delta,this);
};


Area.prototype.height = function(x,y){
	var size = this.props.size;
	var scale = this.props.scale;
	if(x>=0 && y>=0 && x<=size*scale && y<=size*scale){
		var i = Math.floor(x/scale);
		var j = Math.floor(y/scale);
		var ground = this.entities.ground;
		var norm;
		if(x-i+y-j>1){
			norm = triangleNormal(
				(i+1)*scale,(j+1)*scale,ground[i+1][j+1],
				(i+1)*scale,j*scale,ground[i+1][j],
				i*scale,(j+1)*scale,ground[i][j+1]
			);
		}else{
			norm = triangleNormal(
				i*scale,j*scale,ground[i][j],
				(i+1)*scale,j*scale,ground[i+1][j],
				i*scale,(j+1)*scale,ground[i][j+1]
			);
		}
		var d =  -(i*scale*norm[0]+(j+1)*scale*norm[1]+ground[i][j+1]*norm[2]);
		return -(x*norm[0]+y*norm[1]+d)/norm[2];
	}else{
		return 0;
	}
};

module.exports = Area;



function triangleNormal(x0, y0, z0, x1, y1, z1, x2, y2, z2, output) {
  if (!output) output = [];

  var p1x = x1 - x0;
  var p1y = y1 - y0;
  var p1z = z1 - z0;

  var p2x = x2 - x0;
  var p2y = y2 - y0;
  var p2z = z2 - z0;

  var p3x = p1y * p2z - p1z * p2y;
  var p3y = p1z * p2x - p1x * p2z;
  var p3z = p1x * p2y - p1y * p2x;

  var mag = Math.sqrt(p3x * p3x + p3y * p3y + p3z * p3z);
  if (mag === 0) {
    output[0] = 0;
    output[1] = 0;
    output[2] = 0;
  } else {
    output[0] = p3x / mag;
    output[1] = p3y / mag;
    output[2] = p3z / mag;
  }

  return output;
}