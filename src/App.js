import { Canvas } from "@react-three/fiber";
import "./App.css";
import * as THREE from "three";
import { Sky } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import { MyRotatingBox } from "./MyRotatingBox";
import { Floor } from "./Floor";
import { useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import Video from "./Video";
import Model from "./Model";
import ModelViewer from "./components/ModelViewer";

export default function App() {

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  return (
    <div className="App">
      <Canvas
        shadows
        gl={{ alpha: false }}
        raycaster={{
          computeOffsets: (e) => ({
            offsetX: e.target.width / 2,
            offsetY: e.target.height / 2,
          }),
        }}
      >
        <Sky sunPosition={[100, 10, 100]} />
        <ambientLight intensity={0.3} />
        <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
        <directionalLight />
        {/* <ModelViewer scale="40" modelPath={"/assets/room.glb"} /> */}
        <Physics gravity={[0, -9.81, 0]}>
        <Model />

          <MyRotatingBox />
          <Floor />
        </Physics>
      </Canvas>
    </div>
  );
}
