import * as THREE from 'three';
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@latest/dist/cannon-es.min.js";
import { cannonBoxMaterial } from "../utils/variables.const.js";

class Wall {
  constructor(
    textureURL,
    position = { x: 2, y: 1, z: 0 },
    size = { width: 1, height: 1, depth: 1 },
    scene,
    world
  ) {
    this.wallMesh = null;
    this.wallBody = null;
    this.scene = scene;
    this.world = world;

    this.initThreeMesh(textureURL, size, position);
    this.initCannonBody(size, position);
  }

  initThreeMesh(textureURL, size, position) {
    const loader = new THREE.TextureLoader();
    const boxTexture = loader.load(textureURL);
    
    // Use MeshLambertMaterial for flat shading without reflections
    const blockMaterial = new THREE.MeshStandardMaterial({ map: boxTexture });
    const blockGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);

    this.wallMesh = new THREE.Mesh(blockGeometry, blockMaterial);
    this.wallMesh.position.set(position.x, position.y, position.z);

    this.scene.add(this.wallMesh);
    this.wallMesh.castShadow = true; // Blocks in Minecraft can cast shadows
    this.wallMesh.receiveShadow = true; 
  }

  initCannonBody(size, position) {
    const blockShape = new CANNON.Box(new CANNON.Vec3(size.width / 2, size.height / 2, size.depth / 2)); 
    this.wallBody = new CANNON.Body({ mass: 0, material: cannonBoxMaterial });

    this.wallBody.addShape(blockShape);
    this.wallBody.position.set(position.x, position.y, position.z);

    // this.wallBody.fixedRotation = true;
    // this.wallBody.updateMassProperties();

    this.world.addBody(this.wallBody);
  }
}

export default Wall;
