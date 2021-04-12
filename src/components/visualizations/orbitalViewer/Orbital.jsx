import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
// import { MeshLine, MeshLineMaterial } from 'threejs-meshline';
import { useFrame } from 'react-three-fiber';
import { HTML } from 'drei';
import {
  DAY_PER_VIZ_SEC,
  getMinorAxis,
  auToUnit,
  getVelocity,
  degsToRads,
  getFocus,
  getCurve,
  getLineGeometry,
  getAngleFromPos,
  getPosFromArcLength,
  auToMeters,
  unitToAu,
} from './orbitalUtilities.js';
import { label } from './orbital-viewer.module.scss';
import chartColors from '../../../assets/stylesheets/_variables.scss';

// extend({ MeshLine, MeshLineMaterial });

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
  activeVelocityCallback,
  zoomMod,
  defaultZoom,
  type,
  noLabels,
  reset,
}) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const {
    a,
    e,
    i,
    M,
    Node: ascendingNode,
    Peri: peri,
    Principal_desig: pd,
    name,
  } = data || {};

  const [rotation] = useState(() => [
    0,
    degsToRads(i),
    ascendingNode ? degsToRads(ascendingNode) : 0,
  ]);
  const [majAxis] = useState(() => auToUnit(a));
  const [minAxis] = useState(() => getMinorAxis(a, e));
  const [focus] = useState(() => getFocus(majAxis, minAxis));
  const [offsetCenter] = useState(new THREE.Vector3(focus, 0, 0));
  const [sunPos] = useState(new THREE.Vector3(0, 0, 0));
  const [internalInitialized, setInitialized] = useState(false);

  const [path] = useState(() =>
    getCurve(majAxis, minAxis, offsetCenter.x, offsetCenter.y)
  );

  const [pathLine] = useState(() => getLineGeometry(path.getPoints(360)));
  // const [pathLine] = useState(() =>
  //   path.getPoints(360).map(p => new THREE.Vector3(p.x, p.y, 0))
  // );
  const posZero = getPosFromArcLength(0, path);
  const [point, setPoint] = useState({
    position: posZero,
    rotation: [0, 0, 0],
    progress: 0,
    velocity: getVelocity(posZero.distanceTo(sunPos), majAxis),
    period: 0,
  });

  useEffect(() => {
    if (reset > 0) {
      setPoint({
        position: posZero,
        rotation: [0, 0, 0],
        progress: 0,
        velocity: getVelocity(posZero.distanceTo(sunPos), majAxis),
        period: 0,
      });
    }
  }, [reset]);

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

  function getRadius() {
    const minSize = 10;
    const maxSize = 8 / defaultZoom;
    const scaledRadius = minSize / zoomMod;

    return scaledRadius <= maxSize ? scaledRadius : maxSize;
  }

  function getLabelSize() {
    const minSize = 4;
    const maxSize = 18;
    const scaledLabelSize = maxSize * (zoomMod / defaultZoom);

    if (scaledLabelSize <= minSize) {
      return minSize;
    }

    if (scaledLabelSize >= maxSize) {
      return maxSize;
    }

    return scaledLabelSize;
  }

  // Called once when the component first mounts
  useEffect(() => {
    setPoint(getInitialPoint(M || Math.floor(Math.random() * Math.floor(180))));
  }, []);

  // Called whenever frameOverride changes
  useEffect(() => {
    if (frameOverride) updatePoint(false, 1 / 60);
  }, [frameOverride]);

  // Called whenever pointState changes
  useEffect(() => {
    if (active) {
      activeVelocityCallback(auToMeters(unitToAu(point.velocity / 100000)));
    }
  }, [point]);

  // Called every frame
  useFrame((state, delta) => {
    if (initialized || internalInitialized) updatePoint(!playing, delta);
  });

  return (
    <group rotation={rotation}>
      {/* Orbital Path */}
      <group rotation={[0, 0, peri ? degsToRads(peri + 90) : 0]}>
        {/* <mesh ref={mesh}>
          <meshLine attach="geometry" vertices={pathLine} />
          <meshLineMaterial
            attach="material"
            lineWidth={5}
            color={active ? chartColors.chart2 : orbitColor || '#ffffff'}
          />
        </mesh> */}
        <line ref={mesh} geometry={pathLine}>
          <lineBasicMaterial
            attach="material"
            color={active ? chartColors.chart2 : orbitColor || '#ffffff'}
          />
        </line>
        {/* Orbital Object */}
        <mesh
          position={point.position}
          onClick={() => selectionCallback(data, 'neo')}
        >
          {(type === 'planet' || !noLabels || active) && (
            <HTML>
              <div
                className={label}
                style={{
                  fontSize: getLabelSize(),
                }}
              >
                {name || pd}
              </div>
            </HTML>
          )}
          <sphereBufferGeometry
            attach="geometry"
            args={[type !== 'planet' ? getRadius() : objectRadius, 10, 10]}
          />
          <meshBasicMaterial
            attach="material"
            color={
              active ? chartColors.chart2 : objectColor || chartColors.chart1
            }
          />
        </mesh>
        {devMode && (
          <>
            {/* Center */}
            <mesh position={offsetCenter}>
              <sphereBufferGeometry attach="geometry" args={[2, 10, 10]} />
              <meshBasicMaterial attach="material" color={chartColors.chart1} />
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

Orbital.defaultProps = {
  type: 'object',
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
  activeVelocityCallback: PropTypes.func,
  zoomMod: PropTypes.number,
  defaultZoom: PropTypes.number,
  type: PropTypes.string,
  noLabels: PropTypes.bool,
  reset: PropTypes.number,
};

export default Orbital;
