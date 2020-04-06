import React, { useRef, useState } from 'react';
// import PropTypes from 'prop-types';
import { useFrame } from 'react-three-fiber';

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // function spin() {
  //   const $mesh = mesh.current;
  //   if (hovered && !active) {
  //     $mesh.rotation.z += 0.01;
  //     $mesh.rotation.x += 0.01;
  //   }
  //   if (hovered && active) {
  //     $mesh.rotation.y += 0.02;
  //     $mesh.rotation.x += 0.06;
  //   }
  // }

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(spin);

  // onClick={e => setActive(!active)}
  // onPointerOver={e => setHover(true)}
  // onPointerOut={e => setHover(false)}
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
    >
      <boxBufferGeometry attach="geometry" args={[40, 40, 40]} />
      <meshStandardMaterial
        attach="material"
        color={hovered ? 'hotpink' : 'orange'}
      />
    </mesh>
  );
}

export default Box;
