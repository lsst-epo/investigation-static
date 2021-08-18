import React from 'react';
import PropTypes from 'prop-types';
import { HTML } from 'drei';
import { getLabelSize } from './orbitalUtilities.js';

import { label } from './orbital-viewer.module.scss';

function Sun({ defaultZoom, zoomLevel }) {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereBufferGeometry attach="geometry" args={[9, 16, 8]} />
      <meshBasicMaterial attach="material" color="#ffe266" />
      <HTML>
        <div
          className={label}
          style={{
            fontSize: getLabelSize(zoomLevel, defaultZoom),
          }}
        >
          Sun
        </div>
      </HTML>
      {/* <axesHelper args={[1000, 1000, 1000]} /> */}
    </mesh>
  );
}

Sun.propTypes = {
  zoomLevel: PropTypes.number,
  defaultZoom: PropTypes.number,
};

export default Sun;
