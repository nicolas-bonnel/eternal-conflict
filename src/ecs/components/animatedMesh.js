var animatedMesh = {
    name: 'animatedMesh',
    init: function (geometry,materials) {
        this.mesh = new THREE.MorphAnimMesh(geometry, new THREE.MeshFaceMaterial(materials));
	    var mats = this.mesh.material.materials;
	    for (var k in mats) {
	        mats[k].morphTargets = true;
	    }
	 	this.mesh.parseAnimations();
		this.mesh.setDirectionForward();
		this.animationSpeed = 30;
		this.currentAnimation = null;
    }
};