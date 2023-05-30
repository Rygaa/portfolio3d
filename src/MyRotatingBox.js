import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PointerLockControls } from "@react-three/drei";
import { useSphere } from "@react-three/cannon";
import { usePlayerControls } from "./usePlayerControls";
import Video from "./Video";

const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const direction = new THREE.Vector3();

export function MyRotatingBox(props) {
  const { camera, gl } = useThree();
  const { forward, backward, left, right, jump } = usePlayerControls();
  const [ref, api, collision] = useSphere(() => ({
    mass: 20,
    type: "Dynamic",
    position: [0, 10, 0],
    ...props,
  }));
  const SPEED = 10;
  const velocity = useRef([0, 0, 0]);
  const [touchingGround, setTouchingGround] = React.useState(false);
  const [videoPosition, setVideoPosition] = React.useState(new THREE.Vector3());

  const vec = new THREE.Vector3();

  React.useEffect(() => {
    const domElement = gl.domElement;

    const lockPointer = () => {
      domElement.requestPointerLock =
        domElement.requestPointerLock || domElement.mozRequestPointerLock;
      domElement.requestPointerLock();
    };

    const unlockPointer = () => {
      document.exitPointerLock =
        document.exitPointerLock || document.mozExitPointerLock;
      document.exitPointerLock();
    };

    domElement.addEventListener("click", lockPointer);
    return () => {
      domElement.removeEventListener("click", lockPointer);
      unlockPointer();
    };
  }, [document.body]);

  const [oldPositionY, setOldPositionY] = React.useState(0);

  React.useEffect(
    () =>
      api.position.subscribe((v) => {
        if (v[1] < 1) {
          setTouchingGround(true);
        } else {
          setTouchingGround(false);
        }
      }),
    []
  );

  useFrame(({ mouse, viewport, clock }) => {
    ref.current.getWorldPosition(camera.position);

    // console.log(ref.current.position.y);

    if (touchingGround) {
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
    }

  });

  return (
    <>
      <PointerLockControls camera={camera} domElement={document.body} />
      <Video rotation={camera.rotation}  position={camera.position
            .clone()
            .add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-20))} />
      <mesh ref={ref} />
    </>
  );
}
