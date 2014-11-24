var waterMesh = {
    name: 'waterMesh',
    init: function (width,height,renderer, camera, scene, directionalLight) {
    	//water
		// Load textures		
		var waterNormals = new THREE.ImageUtils.loadTexture('data/waternormals.jpg');
		waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 
		// Create the water effect
		this.ms = new THREE.Water(renderer, camera, scene, {
			textureWidth: 256,
			textureHeight: 256,
			waterNormals: waterNormals,
			alpha: 	0.9,
			sunDirection: directionalLight.position.normalize(),
			sunColor: 0xffffff,
			waterColor: 0x406e9f,
			betaVersion: 0,
			side: THREE.DoubleSide
		});
		

		this.mesh = new THREE.Mesh(
			new THREE.PlaneGeometry(width,height, 1, 1), 
			this.ms.material
		);
		for ( var i = 0; i<this.mesh.geometry.vertices.length; i++ ) {
	    	this.mesh.geometry.vertices[i].x += width/2;
			this.mesh.geometry.vertices[i].y += height/2;
	    }
		this.mesh.rotation.x =  Math.PI * 0.5;
		this.mesh.add(this.ms);
    }
};