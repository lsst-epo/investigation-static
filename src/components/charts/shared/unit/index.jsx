/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import StellarUnit from './StellarUnit';
import StandardUnit from './StandardUnit';

const Unit = props => {
  return (
    {
      hubbleConstant: <StandardUnit {...props} />,
      distance: <StandardUnit {...props} />,
      velocity: <StandardUnit {...props} />,
      temperature: <StandardUnit {...props} />,
      lifetime: <StandardUnit {...props} />,
      count: <StandardUnit {...props} />,
      luminosity: <StellarUnit {...props} />,
      mass: <StellarUnit {...props} />,
      volume: <StandardUnit {...props} />,
      radius: <StellarUnit {...props} />,
      inclination: <StandardUnit {...props} />,
      semimajor_axis: <StandardUnit {...props} />,
      size: <StandardUnit {...props} />,
      kineticEnergy: <StandardUnit {...props} />,
    }[props.type] || null
  );
};

Unit.propTypes = {
  type: PropTypes.string,
  isSvg: PropTypes.bool,
};

export default Unit;
