import React from 'react';
import PropTypes from 'prop-types';
import { Canvas } from 'react-three-fiber';
// import Kepler from 'kepler.js/lib/kepler.js';
import Box from '../shared/Box.jsx';
// import Orbital from './Orbital.jsx';
import Orbital from './Orbital.jsx';
import Camera from './Camera.jsx';
import CameraController from './CameraController.jsx';

function OrbitalViewer(props) {
  const { neos } = props;
  console.log(neos);
  return (
    <div style={{ width: '100vw', height: '70vh' }}>
      <Canvas invalidateFrameloop>
        <CameraController />
        <Camera far={200000} near={0.1} fov={75} position={[0, 0, 300]} />
        <ambientLight />
        <pointLight position={[100, 100, 100]} />
        {neos.map(neo => {
          return (
            <Orbital
              key={neo.Ref + neo.Principal_desig}
              data={neo}
              position={[0, 0, 0]}
            />
          );
        })}
        <Box position={[0, 0, 0]} />
        <mesh>
          <planeBufferGeometry
            attach="geometry"
            args={[1000, 1000, 1000, 1000]}
          />
          <meshStandardMaterial
            attach="material"
            color="grey"
            transparent
            opacity={0.4}
          />
        </mesh>
      </Canvas>
    </div>
  );
}

OrbitalViewer.propTypes = {
  neos: PropTypes.array,
};

export default OrbitalViewer;
