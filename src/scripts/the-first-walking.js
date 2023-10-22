import { camera, myPlayer, videoPlane } from "../scene";
import * as THREE from "three";
import { world } from "../scene";

let startQuaternion = new THREE.Quaternion().copy(camera.quaternion);
let targetQuaternion = new THREE.Quaternion();
let backwardQuaternion = new THREE.Quaternion(); // Initialize with your 'backward' quaternion
let t = 0.0;
let tBack = 0.0;
const slerpSpeed = 0.02;
const slerpBackSpeed = 0.005; // Slower slerp speed for looking back
const expFactor = 2.5;
videoPlane.rotate("right");
let scriptFinished = false;
let lookBack = false;

export function the_first_walking() {
  if (!scriptFinished || lookBack) {
    requestAnimationFrame(the_first_walking);
    world.step(1 / 120);

    const reached = myPlayer.scriptedMove(10, 9);
    videoPlane.syncPositionWithPlayer(myPlayer);

    camera.position.y = videoPlane.mesh.position.y;

    if (reached && !lookBack) {
      camera.lookAt(videoPlane.mesh.position);

      if (t < 1.0) {
        t += slerpSpeed;
        const effectiveT = Math.pow(t, expFactor);
        targetQuaternion.copy(camera.quaternion);
        camera.quaternion.copy(startQuaternion);
        camera.quaternion.slerp(targetQuaternion, effectiveT);
      } else {
        setTimeout(() => {
          lookBack = true;
        }, 1000);
      }
    }

    if (lookBack) {
      if (tBack < 1.0) {
        tBack += slerpBackSpeed; // Using slower speed for looking back
        const effectiveTBack = Math.pow(tBack, expFactor);
        startQuaternion.copy(camera.quaternion);
        camera.quaternion.slerp(backwardQuaternion, effectiveTBack);
      } else {
        scriptFinished = true;
        lookBack = false;
      }
    }
  }
}
