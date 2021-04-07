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
import chartColors from '../../../assets/stylesheets/_variables.scss';

function OrbitalViewer({
  neos,
  activeNeo,
  activeObs,
  selectionCallback,
  paused,
  pov,
  defaultZoom,
  potentialOrbits,
  observations,
  noDetails,
  detailsSet,
  refObjs,
  noLabels,
}) {
  const speeds = [365.25, 30, 11.574, 1.1574, 0.00001157]; // [realtime, 100,000 X, 1,000,000 X, 2.592e+6 X, 3.154e+7 X]
  const speedWords = {
    365.25: '1 yr',
    30: '30 days',
    11.574: '12 days',
    1.1574: '1 day',
    0.00001157: '1 sec',
  };

  const [playing, setPlaying] = useState(!paused);
  const [activeVelocity, setActiveVelocity] = useState(null);
  const [stepDirection, setStepDirection] = useState(1);
  const [frameOverride, setFrameOverride] = useState(null);
  const [dayPerVizSec, setDayPerVizSec] = useState(paused ? 0 : speeds[2]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [reset, setReset] = useState(0);
  const handleStartStop = () => {
    setPlaying(!playing);
    setStepDirection(1);
    setFrameOverride(null);
  };

  const handleStepSelect = step => {
    setDayPerVizSec(speeds[step.target.value]);
  };

  const handleZoomReset = () => {
    setReset(reset + 1);
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
        {!potentialOrbits && !noDetails && (
          <OrbitalDetails
            type={detailsSet}
            velocity={activeVelocity}
            data={activeNeo}
          />
        )}
        {!paused && (
          <PlaybackSpeed
            {...{ elapsedTime, dayPerVizSec, speeds, speedWords }}
            sliderOnChangeCallback={handleStepSelect}
          />
        )}
        <Canvas invalidateFrameloop className={orbitalCanvas}>
          <CameraController pov={pov} reset={reset} />
          <Camera
            left={-15000}
            right={15000}
            top={15000}
            bottom={-15000}
            near={0.1}
            far={30000}
            position={[0, 0, 8000]}
            defaultZoom={defaultZoom || 1}
          />
          <ambientLight intensity={0.9} />
          <Orbitals
            activeVelocityCallback={setActiveVelocity}
            defaultZoom={defaultZoom || 1}
            {...{
              refObjs,
              neos,
              activeNeo,
              activeObs,
              playing,
              stepDirection,
              dayPerVizSec,
              frameOverride,
              potentialOrbits,
              observations,
              selectionCallback,
              elapsedTime,
              setElapsedTime,
              noLabels,
            }}
          />
          <mesh position={[0, 0, 0]}>
            <sphereBufferGeometry attach="geometry" args={[15, 16, 8]} />
            <meshBasicMaterial attach="material" color={chartColors.chart5} />
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
              handleZoomReset,
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
  activeObs: PropTypes.object,
  selectionCallback: PropTypes.func,
  paused: PropTypes.bool,
  pov: PropTypes.string,
  defaultZoom: PropTypes.number,
  potentialOrbits: PropTypes.bool,
  observations: PropTypes.array,
  noDetails: PropTypes.bool,
  noLabels: PropTypes.bool,
  detailsSet: PropTypes.string,
  refObjs: PropTypes.array,
};

export default OrbitalViewer;
