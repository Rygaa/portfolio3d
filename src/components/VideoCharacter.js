import * as THREE from "three";

class VideoCharacter {
  constructor(src, position, scene) {
    const video = document.getElementById("myVideo");
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;

    const planeGeometry = new THREE.PlaneGeometry(2, 2); // Adjust size as needed
    const planeMaterial = new THREE.MeshPhongMaterial({ map: videoTexture, side: THREE.DoubleSide });

    this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    this.mesh.position.set(position.x, 1, position.z);

    scene.add(this.mesh);
    video.play();
  }



  syncPositionWithPlayer(player) {
    this.mesh.position.set(player.boxBody.position.x - 2, 1, player.boxBody.position.z);
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
