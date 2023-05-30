import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import React, { useRef, useMemo } from "react";
import * as THREE from "three"; // Add this line
import {
  Debug,
  Physics,
  useBox,
  usePlane,
  useSphere,
  useTrimesh,
  useCylinder,
  useConvexPolyhedron,
} from "@react-three/cannon";
import {
  MeshNormalMaterial,
  IcosahedronGeometry,
  TorusKnotGeometry,
} from "three";
const PATH = "/assets/living-room-packed.glb";
// const PATH = "/assets/living-room-packed.glb";

export default function Model(props) {
  // const group = useRef();
  // const { scene } = useGLTF(PATH);

  // return (
  //   <group ref={group} {...props} dispose={null}>
  //     {scene && <primitive object={scene.clone()} />}
  //   </group>
  // );
  const { nodes } = useGLTF(
    "https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@cannon/public/models/monkey.glb"
  );
  const [ref, api] = useTrimesh(
    () => ({
      args: [
        nodes.Suzanne.geometry.attributes.position.array,
        nodes.Suzanne.geometry.index.array,
      ],
      mass: 1,
      ...props,
    }),
    useRef()
  );
  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      onPointerDown={() => api.velocity.set(0, 5, 0)}
    >
      <mesh
        castShadow
        geometry={nodes.Suzanne.geometry}
        material={useMemo(() => new MeshNormalMaterial(), [])}
      />
    </group>
  );
}

useGLTF.preload(PATH);
