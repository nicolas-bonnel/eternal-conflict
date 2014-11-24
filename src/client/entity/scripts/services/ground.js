angular.module('entity').service('groundService',[function(){

	this.generate = function(size,scale,mountains){
		size= parseInt(size);
		scale= parseInt(scale);
		var maxH = size*scale*mountains;
		var ground = Array.apply(0, Array(size+1)).map(function(){
			return Array.apply(0, Array(size+1));
		});
		
		ground[0][0] = 0*Math.random()*maxH;
		ground[0][size] = 0*Math.random()*maxH;
		ground[size][0] = 0*Math.random()*maxH;
		ground[size][size] = 0*Math.random()*maxH;
		
		var square = size/2;
		
		while(square>=1){
			for(var i=square;i<size;i+=square*2){
				for(var j=square;j<size;j+=square*2){
					ground[i][j] = parseFloat(((ground[i-square][j-square] + ground[i+square][j-square] + ground[i-square][j+square] + ground[i+square][j+square])/4+(0.5-Math.random())*maxH*(square-1)/size).toFixed(2));
					ground[i-square][j] = average(ground,i-square,j,square);
					ground[i+square][j] = average(ground,i+square,j,square);
					ground[i][j-square] = average(ground,i,j-square,square);
					ground[i][j+square] = average(ground,i,j+square,square);
				}
			}
			square /= 2;
		}
		return ground;
	};

	this.mesh = function(ground, scale){
	    var geometry = new THREE.PlaneGeometry(scale*(ground.length-1),scale*(ground[0].length-1),ground.length-1,ground[0].length-1);
	    
	    var uniforms =  THREE.UniformsLib['lights'];
	    uniforms.grass = { type: "t", value: THREE.ImageUtils.loadTexture('./data/textures/grass.jpg') };
	    uniforms.greyrock = { type: "t", value: THREE.ImageUtils.loadTexture('./data/textures/greyrock.jpg') };
	    uniforms.snow = { type: "t", value: THREE.ImageUtils.loadTexture('./data/textures/snow.jpg') };
	    uniforms.lightrock = { type: "t", value: THREE.ImageUtils.loadTexture('./data/textures/lightrock.jpg') };
	    var material = new THREE.ShaderMaterial({
	        uniforms: uniforms,
	        lights: true,
	        vertexShader: document.getElementById( 'groundVertexShader' ).textContent,
	        fragmentShader: document.getElementById( 'groundFragmentShader' ).textContent
	    });
	    //set height of vertices
	    for ( var i = 0; i<geometry.vertices.length; i++ ) {
	    	x = (geometry.vertices[i].x+scale*(ground.length-1)/2)/scale;
	    	y = -(geometry.vertices[i].y-scale*(ground[0].length-1)/2)/scale;
	    	geometry.vertices[i].x = x*scale;
			geometry.vertices[i].z = y*scale;
			geometry.vertices[i].y = ground[x][y];
	    }
	    geometry.computeFaceNormals();
	    geometry.computeVertexNormals();
		
		return new THREE.Mesh( geometry,material ); 
	};

}]);

function average(ground,i,j,square){
	var cpt = 0;
	var acc = 0;
	if(i-square >=0){
		cpt += 1;
		acc += ground[i-square][j];
	}
	if(i+square < ground.length){
		cpt += 1;
		acc += ground[i+square][j];
	}
	if(j-square >=0){
		cpt += 1;
		acc += ground[i][j-square];
	}
	if(j+square < ground.length){
		cpt += 1;
		acc += ground[i][j+square];
	}
	return  parseFloat((acc/cpt).toFixed(2));
}
