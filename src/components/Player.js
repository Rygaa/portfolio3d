import * as THREE from "three";
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@latest/dist/cannon-es.min.js";
import { cannonBoxMaterial } from "../utils/variables.const.js";

class Player {
  velocity = { x: 0, z: 0 };
  maxSpeed = 0.01;  // Halved max speed
  acceleration = 0.0005; // Halved acceleration
  friction = 0.995; // Slightly increased friction for minimal slowdown

  constructor(position = { x: 0, y: 5, z: 0 }, color = 0xff0000, scene, world) {
    this.boxBody = null;
    this.boxMesh = null;
    this.scene = scene;
    this.world = world;

    this.initCannonBody(position);
    this.initThreeMesh(color);
  }

  initCannonBody(position) {
    const radius = 0.5;
    const height = 2.0; // Adjust based on your player's height.

    const capsuleShape = new CANNON.Cylinder(radius, radius, height, 8); // 8 represents the number of segments in the cylinder.
    const quat = new CANNON.Quaternion();
    quat.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2); // Align the capsule upright
    this.boxBody = new CANNON.Body({ mass: 1, material: cannonBoxMaterial });
    this.boxBody.addShape(capsuleShape, new CANNON.Vec3(), quat);
    this.boxBody.position.set(position.x, position.y, position.z);
    this.world.addBody(this.boxBody);
  }

  initThreeMesh(color) {
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
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

  move(direction) {
    switch(direction) {
      case 'forward':
        this.velocity.z = Math.max(-this.maxSpeed, this.velocity.z - this.acceleration);
        break;
      case 'backward':
        this.velocity.z = Math.min(this.maxSpeed, this.velocity.z + this.acceleration);
        break;
      case 'left':
        this.velocity.x = Math.max(-this.maxSpeed, this.velocity.x - this.acceleration);
        break;
      case 'right':
        this.velocity.x = Math.min(this.maxSpeed, this.velocity.x + this.acceleration);
        break;
    }

    // Update Cannon body position
    this.boxBody.position.x += this.velocity.x;
    this.boxBody.position.z += this.velocity.z;

    // Apply friction
    this.velocity.x *= this.friction;
    this.velocity.z *= this.friction;
  }
  
  scriptedMove(targetX, targetZ) {
    const distanceX = targetX - this.boxBody.position.x;
    const distanceZ = targetZ - this.boxBody.position.z;
    let reached = true;
    
    const directionX = distanceX > 0 ? 'right' : 'left';
    const directionZ = distanceZ > 0 ? 'backward' : 'forward';

    if (Math.abs(distanceX) > 0.01) {
      this.move(directionX);
      reached = false;
    }
    
    if (Math.abs(distanceZ) > 0.01) {
      this.move(directionZ);
      reached = false;
    }

    return reached;
  }
}

export default Player;
