import * as THREE from 'three';
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@latest/dist/cannon-es.min.js";
import { cannonBoxMaterial } from "../utils/variables.const.js";

class Player {
  constructor(position = { x: 0, y: 5, z: 0 }, color = 0xff0000, scene, world) {
    this.boxBody = null;
    this.boxMesh = null;
    this.scene = scene
    this.world = world;

    this.initCannonBody(position);
    this.initThreeMesh(color);
  }

  // initCannonBody(position) {
  //   const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  //   this.boxBody = new CANNON.Body({ mass: 1, material: cannonBoxMaterial });
  //   this.boxBody.addShape(boxShape);
  //   this.boxBody.position.set(position.x, position.y, position.z);
  //   this.world.addBody(this.boxBody);
  // }

  initCannonBody(position) {
    const radius = 0.5;
    const height = 1.0; // Adjust based on your player's height.
    
    const capsuleShape = new CANNON.Cylinder(radius, radius, height, 8); // 8 represents the number of segments in the cylinder.
    const quat = new CANNON.Quaternion();
    quat.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI/2); // Align the capsule upright
    this.boxBody = new CANNON.Body({ mass: 1, material: cannonBoxMaterial });
    this.boxBody.addShape(capsuleShape, new CANNON.Vec3(), quat); 
    this.boxBody.position.set(position.x, position.y, position.z);
    this.world.addBody(this.boxBody);
}

  initThreeMesh(color) {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshBasicMaterial({ color });
    this.boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    this.scene.add(this.boxMesh);
  }

  updateMeshPositionFromPhysics() {
    if (this.boxMesh && this.boxBody) {
      this.boxMesh.position.copy(this.boxBody.position);
      this.boxMesh.quaternion.copy(this.boxBody.quaternion);
    }
  }

  updatePosition(position) {
    if (position.x) {
      this.boxBody.position.x += position.x;
    }
    if (position.y) {
      this.boxBody.position.y += position.y;
    }
    if (position.z) {
      this.boxBody.position.z += position.z;
    }
  }
}


export default Player