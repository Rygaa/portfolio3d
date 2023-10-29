import { camera, myPlayer, videoPlane } from "../scene";
import * as THREE from "three";
import { world } from "../scene";

// Initialize quaternions and variables
const startQuaternion = new THREE.Quaternion().copy(camera.quaternion);
const targetQuaternion = new THREE.Quaternion();
const backwardQuaternion = new THREE.Quaternion();
const slerpSpeed = 2.02;
const slerpBackSpeed = 0.005;
const expFactor = 2.5;

let t = 0.0;
let tBack = 0.0;
let scriptFinished = false;
let lookBack = false;
let playerReachedLevel1 = false;
let playerReachedLevel2 = false;

videoPlane.rotate("right");

// Function to control player walking and camera orientation
export function the_first_walking() {
  if (scriptFinished && !lookBack) return;
  
  requestAnimationFrame(the_first_walking);
  world.step(1 / 120);

  // Move player to different positions
  if (!playerReachedLevel1) {
    playerReachedLevel1 = myPlayer.scriptedMove(10, 10);
  } else if (!playerReachedLevel2) {
    playerReachedLevel2 = myPlayer.scriptedMove(10, 5);
  }

  videoPlane.syncPositionWithPlayer(myPlayer);
  camera.position.y = videoPlane.mesh.position.y;

  // Handle camera orientation when the player reaches first position
  if (playerReachedLevel1 && !lookBack) {
    handleLookAtVideoPlane();
  }

  // Handle camera orientation to look back
  if (lookBack) {
    handleLookBack();
  }
}

function handleLookAtVideoPlane() {
  camera.lookAt(videoPlane.mesh.position);
  
  if (t < 1.0) {
    t += slerpSpeed;
    const effectiveT = Math.pow(t, expFactor);
    targetQuaternion.copy(camera.quaternion);
    camera.quaternion.copy(startQuaternion);
    camera.quaternion.slerp(targetQuaternion, effectiveT);
  } else {
    setTimeout(() => { lookBack = false; }, 1000);
  }
}

function handleLookBack() {
  if (tBack < 1.0) {
    tBack += slerpBackSpeed;
    const effectiveTBack = Math.pow(tBack, expFactor);
    startQuaternion.copy(camera.quaternion);
    camera.quaternion.slerp(backwardQuaternion, effectiveTBack);
  } else {
    scriptFinished = true;
    lookBack = false;
  }
}
