import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import "./App.css";
import * as THREE from "three";
import useKeyboardControls from "./useKeyboardControls";
import { Plane, PointerLockControls, Sky, useTexture } from "@react-three/drei";
import TexturedPlane from "./TexturedPlane";
import { useLoader } from "@react-three/fiber";

import { Box } from "@react-three/drei";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import grass from "./grass.jpg";
import { Color } from "three";
const keys = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  Space: "jump",
};
const moveFieldByKey = (key) => keys[key];

const usePlayerControls = () => {
  const [movement, setMovement] = React.useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });
  React.useEffect(() => {
    const handleKeyDown = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }));
    const handleKeyUp = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }));
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return movement;
};
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const direction = new THREE.Vector3();
function MyRotatingBox(props) {
  const { camera, gl} = useThree();
  const { forward, backward, left, right, jump } = usePlayerControls();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 10, 0],
    ...props,
  }));
  const rotation = new THREE.Vector3(0, 50, 0);
  const SPEED = 10;
  const velocity = useRef([0, 0, 0]);

  const vec = new THREE.Vector3();



  React.useEffect(() => {
    const domElement = gl.domElement;

    const lockPointer = () => {
      domElement.requestPointerLock = domElement.requestPointerLock || domElement.mozRequestPointerLock;
      domElement.requestPointerLock();
    };

    const unlockPointer = () => {
      document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
      document.exitPointerLock();
    };

    domElement.addEventListener('click', lockPointer);
    return () => {
      domElement.removeEventListener('click', lockPointer);
      unlockPointer();
    };
  }, [gl.domElement]);

  // Handle mouse movement
  const mouseMovement = React.useRef({ x: 0, y: 0 });
  React.useEffect(() => {
    const handleMouseMove = (event) => {
      mouseMovement.current = {
        x: event.movementX || event.mozMovementX || 0,
        y: event.movementY || event.mozMovementY || 0,
      };
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  useFrame(({ mouse, viewport, clock }) => {

    const elapsedTime = clock.getElapsedTime();

    // Apply mouse movement to camera rotation
    const lookSpeed = 0.001;
    camera.rotation.y -= mouseMovement.current.x * lookSpeed;
    camera.rotation.x -= mouseMovement.current.y * lookSpeed;
    camera.rotation.x = THREE.MathUtils.clamp(
      camera.rotation.x,
      -Math.PI / 2,
      Math.PI / 2
    );
    camera.rotation.y = THREE.MathUtils.clamp(
      camera.rotation.y,
      -Math.PI / 2,
      Math.PI / 2
    );


    // Reset mouse movement
    mouseMovement.current = { x: 0, y: 0 };


    ref.current.getWorldPosition(camera.position);
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);
    api.velocity.set(direction.x, velocity.current[1], direction.z);
    if (jump && Math.abs(velocity.current[1].toFixed(2)) < 0.05)
      api.velocity.set(velocity.current[0], 10, velocity.current[2]);
  });

  return (
    <mesh ref={ref} />
    //   <Box ref={ref}>
    //     <boxBufferGeometry />
    //   <meshStandardMaterial color="royalblue" />
    // </Box>
  );
}



























function Floor(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  const texture = useLoader(THREE.TextureLoader, grass);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial
        map={texture}
        map-repeat={[240, 240]}
        color="green"
      />
    </mesh>
  );
}

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

        <Physics gravity={[0, -9.81, 0]}>
          {/* <TexturedPlane /> */}
          <MyRotatingBox />
          <Floor />
        </Physics>
        {/* <PointerLockControls /> */}
      </Canvas>
    </div>
  );
}
