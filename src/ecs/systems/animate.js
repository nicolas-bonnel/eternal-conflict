var animate = {
    update: function (dt) {
    	var entities = this.world.getEntities('animatedMesh');
       	var animatedMesh;

        entities.forEach(function (entity) {
            animatedMesh = entity.getComponent('animatedMesh');

			if(animatedMesh.currentAnimation){
			 	animatedMesh.mesh.playAnimation(animatedMesh.currentAnimation,animatedMesh.animationSpeed);
			}
        	animatedMesh.mesh.updateAnimation(dt);
        });
    }
};
