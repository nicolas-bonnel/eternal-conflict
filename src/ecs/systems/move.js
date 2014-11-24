var move = {
    update: function (dt) {
        var entities = this.world.getEntities('position', 'velocity');
        var position, velocity;

        entities.forEach(function (entity) {
            position = entity.getComponent('position');
            velocity = entity.getComponent('velocity');
            position.x += velocity.x * dt;
            position.y += velocity.y * dt;
            position.z += velocity.z * dt;
        });
    }
};
