import * as THREE from 'three';

import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@latest/dist/cannon-es.min.js";

class Floor {
  constructor(textureURL, size = { width: 20, height: 20 }, position = { x: 0, y: -0, z: 0 }, scene, world) {
    this.floorMesh = null;
    this.groundBody = null;
    this.scene = scene, 
    this.world = world;
    this.initThreeMesh(textureURL, size);
    this.initCannonBody(size);

    this.setPosition(position);
  }

  initThreeMesh(textureURL, size) {
    const loader = new THREE.TextureLoader();
    const floorTexture = loader.load(textureURL);

    // Set texture to repeat based on ground size (optional but often useful)
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(size.width, size.height);

    const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
    const floorGeometry = new THREE.PlaneGeometry(size.width, size.height);
    
    this.floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.scene.add(this.floorMesh);
  }

  initCannonBody(size) {
    const groundShape = new CANNON.Box(new CANNON.Vec3(size.width / 2, 0.1, size.height / 2));
    this.groundBody = new CANNON.Body({ mass: 0 });
    this.groundBody.addShape(groundShape);
    this.world.addBody(this.groundBody);
  }

  setPosition(position) {
    if (this.floorMesh) {
      this.floorMesh.position.set(position.x, position.y, position.z);
    }

    if (this.groundBody) {
      this.groundBody.position.set(position.x, position.y, position.z);
    }
  }
}

export default Floor;
