import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas } from 'react-three-fiber';
// import * as THREE from 'three';
import Camera from './Camera.jsx';
import CameraController from './CameraController.jsx';
import Orbitals from './Orbitals.jsx';
import Controls from './controls/index.jsx';
import PlaybackSpeed from './PlaybackSpeed.jsx';
import OrbitalDetails from './OrbitalDetails.jsx';

import { container, orbitalCanvas } from './orbital-viewer.module.scss';

function OrbitalViewer({ neos, activeNeo, updateActiveNeo, paused, pov }) {
  const speeds = [0.00001157, 1.1574, 11.574, 30, 365.25]; // [realtime, 100,000 X, 1,000,000 X, 2.592e+6 X, 3.154e+7 X]

  const [playing, setPlaying] = useState(!paused);
  const [activeVelocity, setActiveVelocity] = useState(null);
  const [stepDirection, setStepDirection] = useState(1);
  const [frameOverride, setFrameOverride] = useState(null);
  const [dayPerVizSec, setDayPerVizSec] = useState(speeds[1]);
  const handleStartStop = () => {
    setPlaying(!playing);
    setStepDirection(1);
    setFrameOverride(null);
  };

  const handleStepSelect = () => {
    const lastIndex = speeds.length - 1;
    const oldIndex = speeds.indexOf(dayPerVizSec);
    const newIndex = oldIndex >= lastIndex ? 0 : oldIndex + 1;

    setDayPerVizSec(speeds[newIndex]);
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
    <>
      <div className={container}>
        <OrbitalDetails velocity={activeVelocity} data={activeNeo} />
        <PlaybackSpeed dayPerVizSec={dayPerVizSec} />
        <Canvas invalidateFrameloop className={orbitalCanvas}>
          <CameraController pov={pov} />
          <Camera far={200000} near={1} fov={100} position={[0, 0, 500]} />
          <ambientLight intensity={0.9} />
          <Orbitals
            includeRefObjs
            selectionCallback={updateActiveNeo}
            activeVelocityCallback={setActiveVelocity}
            {...{
              neos,
              activeNeo,
              playing,
              stepDirection,
              dayPerVizSec,
              frameOverride,
            }}
          />
          <mesh position={[0, 0, 0]}>
            <sphereBufferGeometry attach="geometry" args={[10, 16, 8]} />
            <meshBasicMaterial attach="material" color="yellow" />
            {/* <axesHelper args={[1000, 1000, 1000]} /> */}
          </mesh>
        </Canvas>
        {!paused && (
          <Controls
            {...{
              playing,
              handleStartStop,
              handleNext,
              handlePrevious,
              handleStepSelect,
              dayPerVizSec,
            }}
          />
        )}
      </div>
    </>
  );
}

OrbitalViewer.propTypes = {
  neos: PropTypes.array,
  activeNeo: PropTypes.object,
  updateActiveNeo: PropTypes.func,
  paused: PropTypes.bool,
  pov: PropTypes.string,
};

export default OrbitalViewer;
