import * as THREE from "three";
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@latest/dist/cannon-es.min.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

import { cannonBoxMaterial } from "../utils/variables.const.js";

class RectStrip {
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
    this.initLight(position, rotation, dimensions);
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
    this.scene.add(this.stripMesh);
  }

  initLight(position, rotation, dimensions) {
    const light = new THREE.RectAreaLight(0xffffff, 1, dimensions.width, dimensions.height);
    this.scene.add(new RectAreaLightHelper(light));
    light.position.set(position.x, position.y, position.z - 0.1);
    light.rotation.z = rotation.z;
    // light.rotation.y = 90;
    // light.rotation.x = Math.PI / 4;
    light.rotation.y += Math.PI;  // Add π radians to the current Y rotation

    const targetPoint = new THREE.Vector3(
      this.stripBody.position.x,
      this.stripBody.position.y,
      this.stripBody.position.z + 1
    );
    light.lookAt(targetPoint);

    this.scene.add(light);
  }

  updateLightHelper() {
    if (this.lightHelper) {
      this.lightHelper.update();
    }
  }
}

export default RectStrip;
