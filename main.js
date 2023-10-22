import { scene, camera, renderer } from "./src/scene.js";

import {} from "./src/components/Floor.js";
import {} from "./src/components/Player.js";

import { animate } from "./src/animate.js";

import { PointerLockControls } from "./src/utils/PointerLockControls.js"; // Adjust the path if you saved it in a subdirectory.

let pointerLockControls;

pointerLockControls = new PointerLockControls(camera, renderer.domElement);

document.addEventListener(
  "click",
  function () {
    pointerLockControls.lock(); // Lock the pointer when the canvas is clicked
  },
  false
);

scene.add(pointerLockControls.getObject()); // Ad

// 40$
// 55$
// 60$ - 30$

animate();
