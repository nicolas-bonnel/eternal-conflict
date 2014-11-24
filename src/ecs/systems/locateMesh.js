var locateMesh = {
    update: function (dt) {
        var entities = world.getEntities('position','staticMesh');
        var position, mesh;

        entities.forEach(function (entity) {
            position = entity.getComponent('position');
            mesh = entity.getComponent('staticMesh');
            console.log(entity);
            mesh.position.x = position.x;
            mesh.position.y = position.z;
            mesh.position.z = position.y;
        });
        
        entities = this.world.getEntities('position','animatedMesh');
        entities.forEach(function (entity) {
            position = entity.getComponent('position');
            mesh = entity.getComponent('animatedMesh');
            mesh.position.x = position.x;
            mesh.position.y = position.z;
            mesh.position.z = position.y;
        });
    }
};
