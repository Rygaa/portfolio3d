import React, {useRef} from "react";
import { useVideoTexture } from "@react-three/drei";
import videoFile from "./video.mp4";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// function Video({rotation, position, camera}) {
//   const texture = useVideoTexture(videoFile);
//   const [pos, setPos] = React.useState(position)
//   React.useEffect(() => {

//   }, [])

//   const planeRef = React.useRef();

// useFrame((clock) => {
//   if (planeRef.current) {
//     planeRef.current.lookAt(camera.position);
//   }
// });

//   return (
//     <mesh  ref={planeRef} position={position} >
//       {/* <planeGeometry args={[5, 5]} />
//       <meshBasicMaterial map={texture} /> */}
//       <boxGeometry args={[5, 5]}/>
//     </mesh>
//   );
// }

export function Video(props) {
  const ref = useRef();
  const { camera } = useThree();
  const texture = useVideoTexture(videoFile);
  
  useFrame(() => {
    if (ref.current) {
      const distance = 10;
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.multiplyScalar(distance);
      ref.current.position.copy(camera.position).add(direction);
      ref.current.lookAt(camera.position);
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[5, 5]} />
       <meshBasicMaterial map={texture} /> 

      {/* Your other components/materials */}
    </mesh>
  );
}

export default Video;
