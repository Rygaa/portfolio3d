import * as THREE from "three";

class VideoCharacter {
  constructor(position, scene) {
    const video = document.getElementById("myVideo");
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;

    const planeGeometry = new THREE.PlaneGeometry(2, 2); // Adjust size as needed
    const planeMaterial = new THREE.MeshPhongMaterial({
      map: videoTexture,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.01);

    }
  `;

    const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D map;
    uniform float time;
    void main() {
      vec4 centerColor = texture2D(map, vUv);
      vec4 leftColor = texture2D(map, vUv + vec2(-0.01, 0.0));
      vec4 rightColor = texture2D(map, vUv + vec2(0.01, 0.0));
      vec4 topColor = texture2D(map, vUv + vec2(0.0, 0.01));
      vec4 bottomColor = texture2D(map, vUv + vec2(0.0, -0.01));
      gl_FragColor = centerColor;
      
      // if(centerColor.a > 0.0) {
      //   gl_FragColor = centerColor;
      // } else if(leftColor.a > 0.0 || rightColor.a > 0.0 || topColor.a > 0.0 || bottomColor.a > 0.0) {
      //   vec4 avgColor = (leftColor + rightColor + topColor + bottomColor) / 4.0;
      //   gl_FragColor = vec4(avgColor.rgb, 1.0);  // Average color for blur effect
      // } else {
      //   discard;
      // }
    }
  `;
    this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: videoTexture },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
    });

    this.mesh.material = shaderMaterial;

    // this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    this.mesh.position.set(position.x, 1, position.z);

    video.muted = true;

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
