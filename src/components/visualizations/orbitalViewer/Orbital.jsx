import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import {
  STEPS_PER_FRAME,
  getMinorAxis,
  getMajorAxis,
  getVelocity,
  getRotation,
  getRadius,
} from './orbitalUtilities.js';

function Orbital(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const sunPos = new THREE.Vector3();
  const { data } = props;
  const { a, e, i, H } = data || {};
  // Set up state for the hovered and active state
  // const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // const [interval, setInterval] = useState(FPS);
  const [rotation] = useState([0, getRotation(i), 0]);
  const [ObjRadius] = useState(getRadius(H));
  const [majAxis] = useState(getMajorAxis(a));
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

  function updatePoint() {
    const {
      progress: oldProgress,
      position: oldPosition,
      velocity: oldVelocity,
      // rotation: oldRotation,
    } = point;
    const delta = oldVelocity * STEPS_PER_FRAME;
    const progress = oldProgress + delta;
    const { x, y } = path.getPoint(oldProgress + delta);
    const position = new THREE.Vector3(x, y, oldPosition.z);
    const velocity = getVelocity(oldPosition.distanceTo(sunPos), majAxis);
    // const rotation = [0, 0, 0];

    // if (active) {
    //   rotation[1] = oldRotation[1] + 0.02;
    //   rotation[10] = oldRotation[0] + 0.06;
    // }

    setPoint({
      ...point,
      position,
      // rotation,
      progress,
      velocity,
    });
  }

  // Called every frame
  useFrame((state, delta) => {
    updatePoint();
    // if (delta > interval) {
    // setInterval(FPS);
    // } else {
    //   setInterval(interval - delta);
    // }
  });

  return (
    <group rotation={rotation}>
      {/* Orbital Path */}
      <line {...props} ref={mesh} geometry={getLineGeometry(pathPoints)}>
        <lineBasicMaterial
          attach="material"
          color={active ? 'hotpink' : 'green'}
        />
      </line>
      {/* Orbital Object */}
      <mesh
        rotation={point.rotation}
        position={point.position}
        onClick={e => setActive(!active)}
      >
        <sphereBufferGeometry attach="geometry" args={[ObjRadius, 7, 6]} />
        <meshBasicMaterial
          attach="material"
          color={active ? 'hotpink' : 'blue'}
        />
      </mesh>
      {/* Minor Axis */}
      {/*      <mesh position={[0, -minAxis, 0]}>
        <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
        <meshBasicMaterial attach="material" color={'green'} />
      </mesh>
      <mesh position={[0, minAxis, 0]}>
        <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
        <meshBasicMaterial attach="material" color={'green'} />
      </mesh>*/}
      {/* Major Axis */}
      {/*      <mesh position={[majAxis, 0, 0]}>
        <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
        <meshBasicMaterial attach="material" color={'red'} />
      </mesh>
      <mesh position={[-majAxis, 0, 0]}>
        <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
        <meshBasicMaterial attach="material" color={'red'} />
      </mesh>*/}
    </group>
  );
}

Orbital.propTypes = {
  data: PropTypes.object,
};

export default Orbital;
