import * as THREE from "three";
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@latest/dist/cannon-es.min.js";
import { cannonBoxMaterial } from "../utils/variables.const.js";

class LedStrip {
  constructor(
    position = { x: 0, y: 5, z: 0 },
    rotation = { x: 0, y: 0, z: 0 },
    dimensions = { width: 5, height: 0.2, depth: 0.2 },
    scene,
    world
  ) {
    this.stripBody = null;
    this.stripMesh = null;
    this.light = null;
    this.scene = scene;
    this.world = world;

    this.initCannonBody(position, rotation, dimensions);
    this.initThreeMesh(position, rotation, dimensions);
    this.initLight();
  }

  initCannonBody(position, rotation, dimensions) {
    const stripShape = new CANNON.Box(
      new CANNON.Vec3(dimensions.width / 2, dimensions.height / 2, dimensions.depth / 2)
    );
    this.stripBody = new CANNON.Body({ mass: 1, material: cannonBoxMaterial });
    this.stripBody.addShape(stripShape);
    this.stripBody.position.set(position.x, position.y, position.z);
    const cannonEuler = new CANNON.Vec3(rotation.x, rotation.y, rotation.z);
    this.stripBody.quaternion.setFromEuler(cannonEuler.x, cannonEuler.y, cannonEuler.z);
  }

  initThreeMesh(position, rotation, dimensions) {
    const stripGeometry = new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.depth);
    const stripMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
    });
    this.stripMesh = new THREE.Mesh(stripGeometry, stripMaterial);
    this.stripMesh.position.set(position.x, position.y, position.z);
    this.stripMesh.rotation.set(rotation.x, rotation.y, rotation.z);
    this.scene.add(this.stripMesh);
  }

  initLight() {
    this.light = new THREE.SpotLight(0xffffff, 0.25, 20, Math.PI / 4);
    this.light.position.set(this.stripMesh.position.x, this.stripMesh.position.y, this.stripMesh.position.z);

    this.light.rotation.x = -Math.PI / 2;
    this.light.penumbra = 0.5;
    this.scene.add(this.light);
    this.lightHelper = new THREE.SpotLightHelper(this.light);
    this.scene.add(this.lightHelper);
  }

  updateLightHelper() {
    if (this.lightHelper) {
      this.lightHelper.update();
    }
  }
}

export default LedStrip;
