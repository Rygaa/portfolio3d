import * as THREE from "three";
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@latest/dist/cannon-es.min.js";
import { onWindowResize } from "./helpers.js";
import Player from "./components/Player.js";
import Floor from "./components/Floor.js";
import Wall from "./components/Wall.js";
import LedStrip from "./components/LedStrip.js";
import RectStrip from "./components/RectStrip.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

export let scene,
  camera,
  renderer,
  staticScene,
  videoPlane,
  myPlayer,
  myFloor,
  myWall,
  world,
  leftWallStrip,
  rightWallStrip,
  backWallStrip,
  frontWallStrip;

scene = new THREE.Scene();
staticScene = new THREE.Scene();
world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 2;
camera.position.x = 3;
camera.position.z = 9;
camera.lookAt(8, 1, 0);
myPlayer = new Player({ x: 4, y: 1, z: 1 }, 0xff0000, scene, world);
myFloor = new Floor("./src/assets/grass.jpg", undefined, undefined, scene, world);
myWall = new Wall("./src/assets/wall-2.jpg", undefined, undefined, scene, world);

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", onWindowResize, false);

const video = document.getElementById("myVideo");

// Create a VideoTexture
const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBAFormat;

// Create a plane geometry and mesh
const planeGeometry = new THREE.PlaneGeometry(4, 4); // Adjust size as needed
const planeMaterial = new THREE.MeshPhongMaterial({ map: videoTexture, side: THREE.DoubleSide });
videoPlane = new THREE.Mesh(planeGeometry, planeMaterial);

// Optionally set position, rotation, etc. for the plane
videoPlane.position.set(0, 2, -5);
scene.add(videoPlane);

// Constants for room dimensions
// const ROOM_SIZE = {
//   width: 20,
//   height: 10,
//   depth: 20,
// };

// const leftWallPosition = { x: -ROOM_SIZE.width / 2, y: ROOM_SIZE.height / 2, z: 0 };
// const leftWallSize = { width: 1, height: ROOM_SIZE.height, depth: ROOM_SIZE.depth };
// const leftWall = new Wall("./src/assets/wall-2.jpg", leftWallPosition, leftWallSize, scene, world);

// const rightWallPosition = { x: ROOM_SIZE.width / 2, y: ROOM_SIZE.height / 2, z: 0 };
// const rightWall = new Wall("./src/assets/wall-2.jpg", rightWallPosition, leftWallSize, scene, world); // Reuse leftWallSize because it's the same

// const frontWallPosition = { x: 0, y: ROOM_SIZE.height / 2, z: -ROOM_SIZE.depth / 2 };
// const frontWallSize = { width: ROOM_SIZE.width, height: ROOM_SIZE.height, depth: 1 };
// const frontWall = new Wall("./src/assets/wall-2.jpg", frontWallPosition, frontWallSize, scene, world);

// const backWallPosition = { x: 0, y: ROOM_SIZE.height / 2, z: ROOM_SIZE.depth / 2 };
// const backWall = new Wall("./src/assets/wall-2.jpg", backWallPosition, frontWallSize, scene, world); // Reuse frontWallSize because it's the same

// const ceilingPosition = { x: 0, y: 16, z: 0 };
// const ceilingSize = { width: ROOM_SIZE.width, height: ROOM_SIZE.height, depth: ROOM_SIZE.depth };
// const ceiling = new Wall("./src/assets/wall-2.jpg", ceilingPosition, ceilingSize, scene, world);



const ROOM_SIZE = {
  width: 10,
  height: 6,
  depth: 10,
};

const wallThickness = 1;

const leftWallSize = { width: wallThickness, height: ROOM_SIZE.height, depth: ROOM_SIZE.depth };
const leftWallPosition = { x: -ROOM_SIZE.width / 2 + wallThickness / 2, y: ROOM_SIZE.height / 2, z: 0 };
const leftWall = new Wall("./src/assets/wall-2.jpg", leftWallPosition, leftWallSize, scene, world);

const rightWallPosition = { x: ROOM_SIZE.width / 2 - wallThickness / 2, y: ROOM_SIZE.height / 2, z: 0 };
const rightWall = new Wall("./src/assets/wall-2.jpg", rightWallPosition, leftWallSize, scene, world);

const frontWallSize = { width: ROOM_SIZE.width - 2 * wallThickness, height: ROOM_SIZE.height, depth: wallThickness };
const frontWallPosition = { x: 0, y: ROOM_SIZE.height / 2, z: -ROOM_SIZE.depth / 2 + wallThickness / 2 };
const frontWall = new Wall("./src/assets/wall-2.jpg", frontWallPosition, frontWallSize, scene, world);

const backWallPosition = { x: 0, y: ROOM_SIZE.height / 2, z: ROOM_SIZE.depth / 2 - wallThickness / 2 };
const backWall = new Wall("./src/assets/wall-2.jpg", backWallPosition, frontWallSize, scene, world);

const ceilingSize = { width: ROOM_SIZE.width, height: wallThickness, depth: ROOM_SIZE.depth };
const ceilingPosition = { x: 0, y: ROOM_SIZE.height + 4 / 2, z: 0 };
const ceiling = new Wall("./src/assets/wall-2.jpg", ceilingPosition, ceilingSize, scene, world);


const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // soft white light
scene.add(ambientLight);
ambientLight.castShadow = false;

renderer.setClearColor(0x000000); // Set to black
renderer.useLegacyLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.enabled = false;


const halfDepth = ROOM_SIZE.depth / 2 - wallThickness;
const ledStripDimensions = { width: ROOM_SIZE.width - wallThickness * 2, height: 0.1, depth: 0.1 };


const LedStripNumber = 1;
const step = ROOM_SIZE.width / (LedStripNumber - 1) - ledStripDimensions.width / ((LedStripNumber - 1) / 2);
// new RectStrip(
//   { x: 7, y: 1, z: 0 },
//   undefined,
//   ledStripDimensions,
//   scene,
//   world
// );
for (let i = 0; i < LedStripNumber; i++) {
  const xLocation = 0;
  new RectStrip(
    { x: xLocation, y: ROOM_SIZE.height - 0.1, z: halfDepth - 0.1 },
    undefined,
    ledStripDimensions,
    scene,
    world
  );
}

  // new LedStrip(
  //   { x: xLocation, y: ROOM_SIZE.height - 1, z: -halfDepth + 1 },
  //   undefined,
  //   ledStripDimensions,
  //   scene,
  //   world
  // );

  // new LedStrip(
  //   { x: -halfDepth + 1, y: ROOM_SIZE.height - 1, z: xLocation },
  //   { x: 0, y: Math.PI / 2, z: 0 },
  //   ledStripDimensions,
  //   scene,
  //   world
  // );

  // new LedStrip(
  //   { x: halfDepth - 1, y: ROOM_SIZE.height - 1, z: xLocation },
  //   { x: 0, y: Math.PI / 2, z: 0 },

  //   ledStripDimensions,
  //   scene,
  //   world
  // );
// }

// new LedStrip(
//   { x: (ROOM_SIZE.width / 2) + (ROOM_SIZE.width / 2), y: ROOM_SIZE.height - 1, z: halfDepth - 1 },
//   undefined,
//   ledStripDimensions,
//   scene,
//   world
// );

// new LedStrip(
//   { x: (ROOM_SIZE.width / 2) + ledStripDimensions.width, y: ROOM_SIZE.height - 1, z: halfDepth - 1 },
//   undefined,
//   ledStripDimensions,
//   scene,
//   world
// );

// new LedStrip(
//   { x: (ROOM_SIZE.width / 4) + ledStripDimensions.width, y: ROOM_SIZE.height - 1, z: halfDepth - 1 },
//   undefined,
//   ledStripDimensions,
//   scene,
//   world
// );
// new LedStrip(
//   { x: ((ROOM_SIZE.width / 4) / 2) * 1, y: ROOM_SIZE.height - 1, z: halfDepth - 1 },
//   undefined,
//   ledStripDimensions,
//   scene,
//   world
// );
// new LedStrip(
//   { x: ((ROOM_SIZE.width / 4) / 2) * 2, y: ROOM_SIZE.height - 1, z: halfDepth - 1 },

//   undefined,
//   ledStripDimensions,
//   scene,
//   world
// );
// }


RectAreaLightUniformsLib.init()
renderer.useLegacyLights = true;

video.play();
