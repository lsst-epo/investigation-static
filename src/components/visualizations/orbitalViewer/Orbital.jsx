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
}) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const sunPos = new THREE.Vector3();
  const { a, e, i, H } = data || {};
  // Set up state for the hovered and active state
  const [rotation] = useState([0, getRotation(i), 0]);
  const [ObjRadius] = useState(getRadius(H));
  const [majAxis] = useState(auToUnit(a));
  const [minAxis] = useState(getMinorAxis(a, e));

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
  const [pathPoints] = useState(path.getPoints(100));
  const [point, setPoint] = useState(() => {
    const startProgress = Math.random();
    const { x, y } = path.getPoint(startProgress);
    const position = new THREE.Vector3(x, y, 0);

    return {
      position,
      rotation: [0, 0, 0],
      progress: startProgress,
      velocity: getVelocity(position.distanceTo(sunPos), majAxis),
    };
  });

  function updatePoint(paused, delta) {
    const {
      progress: oldProgress,
      position: oldPosition,
      velocity: oldVelocity,
    } = point;
    // const vizTime = dayPerVizSec || DAY_PER_VIZ_SEC;
    const deltaDays = paused ? 0 : delta * (dayPerVizSec || DAY_PER_VIZ_SEC);
    const newProgress = oldVelocity * deltaDays * stepDirection;
    const progress = oldProgress + newProgress;
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

  useEffect(() => {
    if (frameOverride) updatePoint(false, 1 / 60);
  }, [frameOverride]);

  // Called every frame
  useFrame((state, delta) => {
    updatePoint(!playing, delta);
  });

  return (
    <group rotation={rotation}>
      {/* Orbital Path */}
      <line ref={mesh} geometry={getLineGeometry(pathPoints)}>
        <lineBasicMaterial
          attach="material"
          color={active ? 'hotpink' : 'green'}
        />
      </line>
      {/* Orbital Object */}
      <mesh
        rotation={point.rotation}
        position={point.position}
        onClick={() => selectionCallback(data)}
      >
        <sphereBufferGeometry attach="geometry" args={[ObjRadius, 7, 6]} />
        <meshBasicMaterial
          attach="material"
          color={active ? 'hotpink' : 'blue'}
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
};

export default Orbital;
