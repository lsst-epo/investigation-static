import React from 'react';
import PropTypes from 'prop-types';
import { HTML } from 'drei';
import { getLabelSize, ORBITAL_COLORS } from './orbitalUtilities.js';

import { label } from './orbital-viewer.module.scss';

function Sun({ defaultZoom, zoomLevel }) {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereBufferGeometry attach="geometry" args={[9, 16, 8]} />
      <meshBasicMaterial
        attach="material"
        color={ORBITAL_COLORS.sun.objectColor}
      />
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
    </mesh>
  );
}

Sun.propTypes = {
  zoomLevel: PropTypes.number,
  defaultZoom: PropTypes.number,
};

export default Sun;
