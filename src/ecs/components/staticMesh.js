var staticMesh = {
    name: 'staticMesh',
    init: function (geometry,materials,url) {
        this.mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        this.url = url;
    }
};