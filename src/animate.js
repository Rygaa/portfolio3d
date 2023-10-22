import { controls } from "./controls.js";
import {
  camera,
  renderer,
  scene,
  videoPlane,
  myPlayer,
  // myWall,
  world,
  leftWallStrip,
  rightWallStrip,
  backWallStrip,
  frontWallStrip,
  myFloor,
} from "./scene.js";
import * as THREE from "three";
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@latest/dist/cannon-es.min.js";

const velocity = 0.1;
let lookAtVideo = false; // State variable to track camera's look direction
document.getElementById("lookAtVideoBtn").addEventListener("click", () => {
  lookAtVideo = !lookAtVideo; // Toggle the lookAt state
});
let hasRenderedStatic = false;
let i = 0;
let isOnGround = true; // To check if player is on the ground
const jumpForce = new CANNON.Vec3(0, 5, 0); // Upward force for jumping. Adjust the value as needed.

export function animate() {
  requestAnimationFrame(animate);

  // Get the direction the camera is facing for movement purposes
  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);
  cameraDirection.y = 0; // Ensure movement is only horizontal
  cameraDirection.normalize();

  // Calculate right direction for sideways movement
  const rightDirection = new THREE.Vector3();
  rightDirection.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));

  if (controls.moveForward) {
    myPlayer.updatePosition({ x: cameraDirection.x * velocity, z: cameraDirection.z * velocity });
  }
  if (controls.moveBackward) {
    myPlayer.updatePosition({ x: -cameraDirection.x * velocity, z: -cameraDirection.z * velocity });
  }
  if (controls.moveLeft) {
    myPlayer.updatePosition({ x: -rightDirection.x * velocity, z: -rightDirection.z * velocity });
  }
  if (controls.moveRight) {
    myPlayer.updatePosition({ x: rightDirection.x * velocity, z: rightDirection.z * velocity });
  }
  if (controls.jump && isOnGround) {
    // myPlayer.boxBody.velocity.x = 0; // Zero out x velocity
    // myPlayer.boxBody.velocity.z = 0; // Zero out z velocity
    // myPlayer.boxBody.velocity.y = 5; // Adjust value as needed for jump height

    isOnGround = false;
  }

  world.step(1 / 120);

  myPlayer.updateMeshPositionFromPhysics();

  // myWall.wallMesh.position.copy(myWall.wallBody.position);
  // myWall.wallMesh.quaternion.copy(myWall.wallBody.quaternion);

  // Adjusting camera position to be above the box
  camera.position.x = myPlayer.boxMesh.position.x + 0;
  camera.position.y = myPlayer.boxMesh.position.y + 0; // Above the box
  camera.position.z = myPlayer.boxMesh.position.z + 0;

  if (lookAtVideo) {
    camera.lookAt(videoPlane.position); // Look at the video
  }

  renderer.render(scene, camera);
}

myPlayer.boxBody.addEventListener("collide", (event) => {
  if (event.body === myFloor.groundBody) {
    // replace 'groundBody' with your ground's physics body
    isOnGround = true;
    console.log(event.body);
  }
});
