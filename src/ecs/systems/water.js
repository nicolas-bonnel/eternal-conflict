var water = {
    update: function (dt) {
    	var entities = this.world.getEntities('waterMesh');
       	var waterMesh;

        entities.forEach(function (entity) {
            waterMesh = entity.getComponent('waterMesh');
			waterMesh.ms.material.uniforms.time.value += 0.2 / dt;
			waterMesh.ms.render();
			
        });
    }
};