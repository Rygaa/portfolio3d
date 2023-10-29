import * as THREE from "three";

class VideoCharacter {
  constructor(position, scene) {
    const video = document.getElementById("myVideo");
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;

    const planeGeometry = new THREE.PlaneGeometry(2, 2); // Adjust size as needed
    const planeMaterial = new THREE.MeshPhongMaterial({  map: videoTexture, side: THREE.DoubleSide, transparent: true });
    planeMaterial.emissive.set(0x004040);  // This color will be added on top of the texture.

    this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    this.mesh.position.set(position.x, 1, position.z);

    video.muted = true;

    scene.add(this.mesh);
    video.play();


    this.light = new THREE.PointLight(0xffffff, 1, 100);
    this.light.position.set(position.x, position.y + 5, position.z);
    scene.add(this.light);

    document.getElementById("editEmissive").addEventListener("input", function(event) {
      const color = event.target.value;
      if (/^#[0-9A-F]{6}$/i.test(color)) {
        // this.mesh.material.emissive.set(color);
        planeMaterial.emissive.set(color);  // This color will be added on top of the texture.

      }
    });
    

  }



  syncPositionWithPlayer(player) {
    this.mesh.position.set(player.boxBody.position.x - 1, 1, player.boxBody.position.z);
    this.light.position.set(player.boxBody.position.x, player.boxBody.position.y + 5, player.boxBody.position.z);
  }

  rotate(direction) {
    const angle = Math.PI / 2; // 90 degrees
    switch (direction) {
      case "left":
        this.mesh.rotation.y += angle;
        break;
      case "right":
        this.mesh.rotation.y -= angle;
        break;
      case "up":
        this.mesh.rotation.x -= angle;
        break;
      case "down":
        this.mesh.rotation.x += angle;
        break;
    }
  }
}

export default VideoCharacter;
