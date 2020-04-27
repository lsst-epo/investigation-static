import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas } from 'react-three-fiber';
// import Kepler from 'kepler.js/lib/kepler.js';
import Box from '../shared/Box.jsx';
// import Orbital from './Orbital.jsx';
import Orbital from './Orbital.jsx';
import Camera from './Camera.jsx';
import Details from './OrbitalDetails.jsx';
import CameraController from './CameraController.jsx';
import { container } from './orbital-viewer.module.scss';

function OrbitalViewer(props) {
  const { neos } = props;
  const [activeNeo, setActiveNeo] = useState(null);

  function updateActive(neo) {
    setActiveNeo(neo === activeNeo ? null : neo);
  }

  return (
    <div className={container}>
      <Canvas invalidateFrameloop>
        <CameraController />
        <Camera far={200000} near={0.1} fov={75} position={[0, 0, 300]} />
        <ambientLight />
        <pointLight position={[100, 100, 100]} />
        {neos.map(neo => {
          const { Ref: ref, Principal_desig: pd } = neo;

          return (
            <Orbital
              key={ref + pd}
              data={neo}
              position={[0, 0, 0]}
              active={neo === activeNeo}
              selectionCallback={updateActive}
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
      <Details data={activeNeo} />
    </div>
  );
}

OrbitalViewer.propTypes = {
  neos: PropTypes.array,
};

export default OrbitalViewer;
