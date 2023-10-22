import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@latest/dist/cannon-es.min.js";

function loadComplexGLBModel(url, position = { x: 0, y: 0, z: 0 }, scene, world) {
  const loader = new GLTFLoader();
  const wireframeBodies = []; // Store both wireframes and bodies for easier updating later

  loader.load(url, (gltf) => {
    gltf.scene.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BufferGeometry) {
        const mesh = child.clone();
        scene.add(mesh);
        console.log(child.material); // Log material properties

        // Calculate the bounding box of the mesh
        const boundingBox = new THREE.Box3().setFromObject(mesh);
        const boxSize = boundingBox.getSize(new THREE.Vector3());
        const boxCenter = boundingBox.getCenter(new THREE.Vector3());

        // Create the Cannon-ES body and shape based on the bounding box
        const halfExtents = new CANNON.Vec3(boxSize.x / 2, boxSize.y / 2, boxSize.z / 2);
        const boxShape = new CANNON.Box(halfExtents);

        const boxBody = new CANNON.Body({ mass: 0 });
        boxBody.addShape(boxShape);
        boxBody.position.set(boxCenter.x + position.x, boxCenter.y + position.y, boxCenter.z + position.z);
        boxBody.quaternion.set(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w);

        
        world.addBody(boxBody);

        const originalMaterial = child.material.clone();
        const wireframeMaterialProperties = {
            wireframe: true,
            color: originalMaterial.color,
            map: originalMaterial.map,
            roughness: originalMaterial.roughness || 0.5, // Default value if roughness isn't set
            metalness: originalMaterial.metalness || 0.5  // Default value if metalness isn't set
            // You can continue copying other properties you need
        };
        
        const wireframeMaterial = new THREE.MeshStandardMaterial(wireframeMaterialProperties);
        
        const geometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);
        const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
        
        wireframeMesh.position.copy(boxCenter);
        wireframeMesh.quaternion.copy(mesh.quaternion);
        
        scene.add(wireframeMesh);
        



        wireframeBodies.push({
          wireframe: wireframeMesh,
          body: boxBody,
        });
      }
    });
  });

  return wireframeBodies;
}

function updateWireframes(wireframeBodies) {
  wireframeBodies.forEach((item) => {
    const { wireframe, body } = item;
    wireframe.position.copy(body.position);
    wireframe.quaternion.copy(body.quaternion);
  });
}

export { loadComplexGLBModel, updateWireframes };
