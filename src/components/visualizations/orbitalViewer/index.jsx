import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas } from 'react-three-fiber';
import Box from '../shared/Box.jsx';
import Orbitals from './Orbitals.jsx';
import Camera from './Camera.jsx';
import PlaybackSpeed from './PlaybackSpeed.jsx';
import Details from './OrbitalDetails.jsx';
import CameraController from './CameraController.jsx';
import Controls from './controls/index.jsx';

import { container } from './orbital-viewer.module.scss';

function OrbitalViewer({ neos }) {
  const speeds = [0.25, 0.5, 1, 10, 30];

  const [activeNeo, setActiveNeo] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [stepDirection, setStepDirection] = useState(1);
  const [frameOverride, setFrameOverride] = useState(null);
  const [dayPerVizSec, setDayPerVizSec] = useState(speeds[0]);

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
          <Camera far={200000} near={0.1} fov={75} position={[0, 0, 300]} />
          <ambientLight />
          <pointLight position={[100, 100, 100]} />
          <Orbitals
            selectionCallback={updateActive}
            {...{
              neos,
              activeNeo,
              playing,
              stepDirection,
              dayPerVizSec,
              frameOverride,
            }}
          />
          <Box position={[0, 0, 0]} />
          <mesh>
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
          </mesh>
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
      <Details data={activeNeo} />
    </div>
  );
}

OrbitalViewer.propTypes = {
  neos: PropTypes.array,
};

export default OrbitalViewer;
