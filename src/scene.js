import * as THREE from "three";
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@latest/dist/cannon-es.min.js";
import { onWindowResize } from "./helpers.js";
import Player from "./components/Player.js";
import Floor from "./components/Floor.js";
import { loadComplexGLBModel, updateWireframes } from "./utils/loadComplexGlbModel.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import VideoCharacter from "./components/VideoCharacter.js";

export let scene,
  camera,
  renderer,
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
world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 2;
camera.position.x = 3;
camera.position.z = 9;
camera.lookAt(8, 1, 0);
myPlayer = new Player({ x: 10, y: 0.6, z: 10 }, 0xff0000, scene, world);
myFloor = new Floor("./src/assets/grass.jpg", undefined, undefined, scene, world);
myWall = null;

renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// renderer.setClearColor( 0x000000, 0 ); // the default

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", onWindowResize, false);

const ambientLight = new THREE.AmbientLight(0x404040, 2.2); // soft white light
scene.add(ambientLight);
ambientLight.castShadow = false;

renderer.setClearColor(0x000000); // Set to black
renderer.useLegacyLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.enabled = false;

RectAreaLightUniformsLib.init();
renderer.useLegacyLights = true;

// const rewr = loadComplexGLBModel("./room.glb", { x: 100, y: 0, z: 100 }, scene, world);

videoPlane = new VideoCharacter("path_to_your_video_file", { x: 0, y: 10, z: -2 }, scene);
const yOffset = 2;  // Choose the offset that suits your needs
camera.position.y = videoPlane.mesh.position.y + yOffset;
const elevatedFOV = 90; // Choose a higher FOV value that suits your needs
camera.fov = elevatedFOV;
camera.updateProjectionMatrix();