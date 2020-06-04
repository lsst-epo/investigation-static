import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { useFrame } from 'react-three-fiber';
import { HTML } from 'drei';
import {
  DAY_PER_VIZ_SEC,
  getMinorAxis,
  auToUnit,
  getVelocity,
  getRadius,
  degsToRads,
  getFocus,
  getCurve,
  getLineGeometry,
  getAngleFromPos,
  getPosFromArcLength,
} from './orbitalUtilities.js';
import { label } from './orbital-viewer.module.scss';

const Orbital = ({
  data,
  selectionCallback,
  active,
  playing,
  dayPerVizSec,
  stepDirection,
  frameOverride,
  orbitColor,
  objectColor,
  objectRadius,
  initialized,
  initCallback,
  devMode,
}) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const {
    a,
    e,
    i,
    H,
    M,
    Node: ascendingNode,
    Peri: peri,
    Principal_desig: scientificName,
    Name: name,
  } = data || {};

  const [rotation] = useState(() => [
    0,
    degsToRads(i),
    ascendingNode ? degsToRads(ascendingNode) : 0,
  ]);
  const [vizRadius] = useState(() => getRadius(H));
  const [majAxis] = useState(() => auToUnit(a));
  const [minAxis] = useState(() => getMinorAxis(a, e));
  const [focus] = useState(() => getFocus(majAxis, minAxis));
  const [offsetCenter] = useState(new THREE.Vector3(focus, 0, 0));
  const [sunPos] = useState(new THREE.Vector3(0, 0, 0));
  const [internalInitialized, setInitialized] = useState(false);

  const [path] = useState(() =>
    getCurve(majAxis, minAxis, offsetCenter.x, offsetCenter.y)
  );

  const [pathLine] = useState(() => getLineGeometry(path.getPoints(100)));
  const posZero = getPosFromArcLength(0, path);
  const [point, setPoint] = useState({
    position: posZero,
    rotation: [0, 0, 0],
    progress: 0,
    velocity: getVelocity(posZero.distanceTo(sunPos), majAxis),
    period: 0,
  });

  function getInitialPoint(targetAngle) {
    const length180 = 0.5;
    let arcLength = 0;
    let position = getPosFromArcLength(arcLength, path);
    if (targetAngle) {
      const greaterThan180 = targetAngle > 180;
      const modTargetAngle = greaterThan180 ? targetAngle - 180 : targetAngle;
      let angle = getAngleFromPos(position, sunPos);

      while (angle < modTargetAngle) {
        arcLength += 0.01;
        position = getPosFromArcLength(arcLength, path);
        angle = getAngleFromPos(position, sunPos);
      }

      if (greaterThan180) {
        arcLength += length180;
        position = getPosFromArcLength(arcLength, path);
      }
    }

    if (initCallback) {
      initCallback();
    } else {
      setInitialized(true);
    }

    return {
      position,
      rotation: [0, 0, 0],
      progress: arcLength,
      velocity: getVelocity(position.distanceTo(sunPos), majAxis),
      period: 0,
    };
  }

  function updatePoint(paused, delta) {
    const {
      progress: oldProgress,
      position: oldPosition,
      velocity: oldVelocity,
      period: oldPeriod,
    } = point;

    const deltaDays = paused ? 0 : delta * (dayPerVizSec || DAY_PER_VIZ_SEC);
    const deltaDist = oldVelocity * deltaDays * stepDirection;
    const newProgress = oldProgress + deltaDist / path.getLength();
    const progress = newProgress > 1 ? 1 - newProgress : newProgress;
    const { x, y } = path.getPoint(progress);
    const position = new THREE.Vector3(x, y, 0);
    const velocity = getVelocity(oldPosition.distanceTo(sunPos), majAxis);
    let period = deltaDays + oldPeriod;

    if (newProgress > 1) {
      period = 0;
    }
    setPoint({
      ...point,
      position,
      progress,
      velocity,
      period,
    });
  }

  // Called once when the component first mounts
  useEffect(() => {
    setPoint(getInitialPoint(M));
  }, []);

  // Called whenever frameOverride changes
  useEffect(() => {
    if (frameOverride) updatePoint(false, 1 / 60);
  }, [frameOverride]);

  // Called every frame
  useFrame((state, delta) => {
    if (initialized || internalInitialized) updatePoint(!playing, delta);
  });

  return (
    <group rotation={rotation}>
      {/* Orbital Path */}
      <group rotation={[0, 0, peri ? degsToRads(peri + 90) : 0]}>
        <line ref={mesh} geometry={pathLine}>
          <lineBasicMaterial
            attach="material"
            color={active ? 'hotpink' : orbitColor || '#ffffff'}
          />
        </line>
        {/* Orbital Object */}
        <mesh position={point.position} onClick={() => selectionCallback(data)}>
          <HTML>
            <div className={label}>{name || scientificName}</div>
          </HTML>
          <sphereBufferGeometry
            attach="geometry"
            args={[objectRadius || vizRadius, 10, 10]}
          />
          <meshBasicMaterial
            attach="material"
            color={active ? 'hotpink' : objectColor || 'red'}
          />
        </mesh>
        {devMode && (
          <>
            {/* Center */}
            <mesh position={offsetCenter}>
              <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
              <meshBasicMaterial attach="material" color="red" />
              <HTML>
                <div className={label}>center</div>
              </HTML>
            </mesh>
            {/* Foci */}
            <mesh position={sunPos}>
              <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
              <meshBasicMaterial
                attach="material"
                color={objectColor || 'blue'}
              />
              <HTML>
                <div className={label}>sun</div>
              </HTML>
            </mesh>
            <mesh
              position={[
                offsetCenter.x,
                -minAxis + offsetCenter.y,
                offsetCenter.z,
              ]}
            >
              <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
              <meshBasicMaterial attach="material" color="green" />
              <HTML>
                <div className={label}>minor axis vertex</div>
              </HTML>
            </mesh>
            <mesh
              position={[
                offsetCenter.x,
                minAxis + offsetCenter.y,
                offsetCenter.z,
              ]}
            >
              <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
              <meshBasicMaterial attach="material" color="green" />
              <HTML>
                <div className={label}>minor axis vertex</div>
              </HTML>
            </mesh>
            {/* Major Axis */}
            <mesh
              position={[
                majAxis + offsetCenter.x,
                offsetCenter.y,
                offsetCenter.z,
              ]}
            >
              <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
              <meshBasicMaterial attach="material" color="green" />
              <HTML>
                <div className={label}>major axis vertex</div>
              </HTML>
            </mesh>
            <mesh
              position={[
                -majAxis + offsetCenter.x,
                offsetCenter.y,
                offsetCenter.z,
              ]}
            >
              <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
              <meshBasicMaterial attach="material" color="green" />
              <HTML>
                <div className={label}>major axis vertex</div>
              </HTML>
            </mesh>
          </>
        )}
      </group>
    </group>
  );
};

Orbital.propTypes = {
  data: PropTypes.object,
  selectionCallback: PropTypes.func,
  active: PropTypes.bool,
  playing: PropTypes.bool,
  dayPerVizSec: PropTypes.number,
  stepDirection: PropTypes.number,
  frameOverride: PropTypes.number,
  orbitColor: PropTypes.string,
  objectColor: PropTypes.string,
  objectRadius: PropTypes.number,
  initCallback: PropTypes.func,
  initialized: PropTypes.bool,
  devMode: PropTypes.bool,
};

export default Orbital;
