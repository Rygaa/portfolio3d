import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Plane, useTexture } from '@react-three/drei';
import grass from "./grass.jpg"
function TexturedPlane() {
  const texture = useTexture(grass);

  return (
    <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <meshStandardMaterial map={texture} />
    </Plane>
  );
}

export default TexturedPlane;