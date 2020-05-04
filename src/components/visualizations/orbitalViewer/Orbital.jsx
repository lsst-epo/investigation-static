import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import {
  DAY_PER_VIZ_SEC,
  getMinorAxis,
  auToUnit,
  getVelocity,
  getRotation,
  getRadius,
} from './orbitalUtilities.js';

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
}) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const sunPos = new THREE.Vector3();
  const { a, e, i, H, M } = data || {};
  // Set up state for the hovered and active state
  const [rotation] = useState([0, getRotation(i), 0]);
  const [vizRadius] = useState(getRadius(H));
  const [majAxis] = useState(auToUnit(a));
  const [minAxis] = useState(getMinorAxis(a, e));
  const [internalInitialized, setInitialized] = useState(false);

  function getLineGeometry(points) {
    return new THREE.BufferGeometry().setFromPoints(points);
  }

  function getCurve(xRadius, yRadius) {
    return new THREE.EllipseCurve(
      0, // aX
      0, // aY
      xRadius, // xRadius
      yRadius, // yRadius
      0, // aStartAngle
      2 * Math.PI, // aEndAngle
      false, // aClockwise
      0 // aRotation
    );
  }

  const [path] = useState(getCurve(majAxis, minAxis));

  function getPosFromArcLength(arcLength) {
    const { x, y } = path.getPoint(arcLength);
    return new THREE.Vector3(x, y, 0);
  }

  const [pathPoints] = useState(path.getPoints(100));
  const posZero = getPosFromArcLength(0);
  const [point, setPoint] = useState({
    position: posZero,
    rotation: [0, 0, 0],
    progress: 0,
    velocity: getVelocity(posZero.distanceTo(sunPos), majAxis),
  });

  function getAngleFromPos(pos) {
    // x=c; y=a; z=b
    const z = pos.distanceTo(sunPos);
    const { x, y } = pos;
    const rads = Math.acos((z * z + x * x - y * y) / (2 * z * x));
    return (rads * 180) / Math.PI;
  }

  function getInitialPoint(targetAngle) {
    const length180 = 0.5;
    let arcLength = 0;
    let position = getPosFromArcLength(arcLength);

    if (targetAngle) {
      const greaterThan180 = targetAngle > 180;
      const modTargetAngle = greaterThan180 ? targetAngle - 180 : targetAngle;
      let angle = getAngleFromPos(position);

      while (angle < modTargetAngle) {
        arcLength += 0.01;
        position = getPosFromArcLength(arcLength);
        angle = getAngleFromPos(position);
      }

      if (greaterThan180) {
        arcLength += length180;
        position = getPosFromArcLength(arcLength);
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
    };
  }

  function updatePoint(paused, delta) {
    const {
      progress: oldProgress,
      position: oldPosition,
      velocity: oldVelocity,
    } = point;
    // const vizTime = dayPerVizSec || DAY_PER_VIZ_SEC;
    const deltaDays = paused ? 0 : delta * (dayPerVizSec || DAY_PER_VIZ_SEC);
    const newProgress = oldProgress + oldVelocity * deltaDays * stepDirection;
    const progress = newProgress > 1 ? 1 - newProgress : newProgress;
    const { x, y } = path.getPoint(progress);
    const position = new THREE.Vector3(x, y, 0);
    const velocity = getVelocity(oldPosition.distanceTo(sunPos), majAxis);

    setPoint({
      ...point,
      position,
      progress,
      velocity,
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
      <line ref={mesh} geometry={getLineGeometry(pathPoints)}>
        <lineBasicMaterial
          attach="material"
          color={active ? 'hotpink' : orbitColor || '#ffffff'}
        />
      </line>
      {/* Orbital Object */}
      <mesh
        rotation={point.rotation}
        position={point.position}
        onClick={() => selectionCallback(data)}
      >
        <sphereBufferGeometry
          attach="geometry"
          args={[objectRadius || vizRadius, 10, 10]}
        />
        <meshBasicMaterial
          attach="material"
          color={active ? 'hotpink' : objectColor || 'blue'}
        />
      </mesh>
      {/* Minor Axis */}
      {/* <mesh position={[0, -minAxis, 0]}>
        <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
        <meshBasicMaterial attach="material" color={'green'} />
      </mesh>
      <mesh position={[0, minAxis, 0]}>
        <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
        <meshBasicMaterial attach="material" color={'green'} />
      </mesh> */}
      {/* Major Axis */}
      {/* <mesh position={[majAxis, 0, 0]}>
        <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
        <meshBasicMaterial attach="material" color={'red'} />
      </mesh>
      <mesh position={[-majAxis, 0, 0]}>
        <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
        <meshBasicMaterial attach="material" color={'red'} />
      </mesh> */}
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
};

export default Orbital;
