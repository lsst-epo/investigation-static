import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas } from 'react-three-fiber';
// import Kepler from 'kepler.js/lib/kepler.js';
import Box from '../shared/Box.jsx';
// import Orbital from './Orbital.jsx';
import Orbitals from './Orbitals.jsx';
import Camera from './Camera.jsx';
import Details from './OrbitalDetails.jsx';
import CameraController from './CameraController.jsx';
import Controls from './controls/index.jsx';
// import { STEPS_PER_FRAME } from './orbitalUtilities.js';

import { container, playbackSpeed } from './orbital-viewer.module.scss';

function OrbitalViewer({ neos }) {
  const speeds = [2, 4, 8, 16];

  const [activeNeo, setActiveNeo] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [stepDirection, setStepDirection] = useState(1);
  const [frameOverride, setFrameOverride] = useState(null);
  const [stepsPerFrame, setStepsPerFrame] = useState(speeds[0]);

  function updateActive(neo) {
    setActiveNeo(neo === activeNeo ? null : neo);
  }

  const handleStartStop = () => {
    setPlaying(!playing);
    setStepDirection(1);
    setFrameOverride(null);
  };

  const handleStepSelect = () => {
    const lastIndex = speeds.length - 1;
    const oldIndex = speeds.indexOf(stepsPerFrame);
    const newIndex = oldIndex >= lastIndex ? 0 : oldIndex + 1;

    setStepsPerFrame(speeds[newIndex]);
  };

  const handleNext = () => {
    setPlaying(false);
    setStepDirection(1);
    setFrameOverride(frameOverride + 1);
  };

  const handlePrevious = () => {
    setPlaying(false);
    setStepDirection(-1);
    setFrameOverride(frameOverride + 1);
  };

  return (
    <div>
      <div className={container}>
        <div className={playbackSpeed}>
          1 second = {stepsPerFrame * 30} days
        </div>
        <Canvas invalidateFrameloop>
          <CameraController />
          <Camera far={200000} near={0.1} fov={75} position={[0, 0, 300]} />
          <ambientLight />
          <pointLight position={[100, 100, 100]} />
          <Orbitals
            neos={neos}
            activeNeo={activeNeo}
            selectionCallback={updateActive}
            playing={playing}
            stepDirection={stepDirection}
            stepsPerFrame={stepsPerFrame}
            frameOverride={frameOverride}
          />
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
        <Controls
          {...{
            playing,
            handleStartStop,
            handleNext,
            handlePrevious,
            handleStepSelect,
            stepsPerFrame,
          }}
        />
      </div>
      <Details data={activeNeo} />
    </div>
  );
}

OrbitalViewer.propTypes = {
  neos: PropTypes.array,
};

export default OrbitalViewer;
