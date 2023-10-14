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
    // this.stripMesh.visible = false;

    this.stripMesh.material.depthTest = false;
    this.stripMesh.material.depthWrite = false;

    this.scene.add(this.stripMesh);
  }

  initLight(position, rotation, dimensions) {
    // Loop over the six faces of the box
    const spacing = 0.001
    const orientations = [
      { rot: { x: -Math.PI / 2, y: 0, z: 0 }, offset: { x: 0, y: -(dimensions.depth / 2) - spacing, z: 0 }, width: dimensions.width, height: dimensions.height }, // bottom
      { rot: { x: Math.PI / 2, y: 0, z: 0 }, offset: { x: 0, y: +(dimensions.depth / 2) + spacing, z: 0 }, width: dimensions.width, height: dimensions.height }, // top
      { rot: { x: 0, y: 0, z: 0 }, offset: { x: 0, y: 0, z: -(dimensions.depth / 2) - spacing }, width: dimensions.width, height: dimensions.height }, // right
      { rot: { x: 0, y: Math.PI, z: 0 }, offset: { x: 0, y: 0, z: +(dimensions.depth / 2) + spacing }, width: dimensions.width, height: dimensions.height }, // left
      { rot: { x: 0, y: Math.PI / 2, z: 0 }, offset: { x: -(dimensions.width / 2) - spacing, y: 0, z: 0 }, width: dimensions.depth, height: dimensions.height }, // small-left
      { rot: { x: 0, y: -Math.PI / 2, z: 0 }, offset: { x: +(dimensions.width / 2) + spacing, y: 0, z: 0 }, width: dimensions.depth, height: dimensions.height }, // small-right
    ];

    orientations.forEach(orientation => {
      const light = new THREE.RectAreaLight(0xffffff, 1, orientation.width, orientation.height);
      light.position.set(
        position.x + orientation.offset.x,
        position.y + orientation.offset.y,
        position.z + orientation.offset.z
      );
      light.rotation.set(orientation.rot.x, orientation.rot.y, orientation.rot.z);
      const lightHelper = new RectAreaLightHelper(light);
      this.scene.add(lightHelper);
      this.scene.add(light);
    });
  }

  updateLightHelper() {
    if (this.lightHelper) {
      this.lightHelper.update();
    }
  }
}

export default RectStrip;
