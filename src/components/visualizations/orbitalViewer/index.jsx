import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas } from 'react-three-fiber';
import Camera from './Camera.jsx';
import CameraController from './CameraController.jsx';
import Orbitals from './Orbitals.jsx';
import Controls from './controls/index.jsx';
import PlaybackSpeed from './PlaybackSpeed.jsx';

import { container } from './orbital-viewer.module.scss';

function OrbitalViewer({ neos, activeNeo, updateActiveNeo }) {
  const speeds = [0.25, 0.5, 1, 10, 30];

  const [playing, setPlaying] = useState(true);
  const [stepDirection, setStepDirection] = useState(1);
  const [frameOverride, setFrameOverride] = useState(null);
  const [dayPerVizSec, setDayPerVizSec] = useState(speeds[0]);

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
    <div>
      <div className={container}>
        <PlaybackSpeed dayPerVizSec={dayPerVizSec} />
        <Canvas invalidateFrameloop>
          <CameraController />
          <Camera far={200000} near={0.1} fov={75} position={[0, 0, 500]} />
          <ambientLight intensity={0.9} />
          <Orbitals
            includeRefObjs
            selectionCallback={updateActiveNeo}
            {...{
              neos,
              activeNeo,
              playing,
              stepDirection,
              dayPerVizSec,
              frameOverride,
            }}
          />
          <pointLight
            position={[0, 0, 0]}
            intensity={2.5}
            decay={2.0}
            distance={100}
            color="yellow"
          >
            <mesh position={[0, 0, 0]}>
              <sphereBufferGeometry attach="geometry" args={[10, 16, 8]} />
              <meshBasicMaterial attach="material" color="yellow" />
            </mesh>
          </pointLight>
          {/* <mesh>
            <planeBufferGeometry
              attach="geometry"
              args={[1000, 1000, 1000, 1000]}
            />
            <meshStandardMaterial
              attach="material"
              color="white"
              transparent
              opacity={0.1}
            />
          </mesh> */}
        </Canvas>
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
      </div>
    </div>
  );
}

OrbitalViewer.propTypes = {
  neos: PropTypes.array,
  activeNeo: PropTypes.object,
  updateActiveNeo: PropTypes.func,
};

export default OrbitalViewer;
