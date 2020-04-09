import React from 'react';
import PropTypes from 'prop-types';

export default function FindDiameter(props) {
  const { diameter, magnitude, albedo } = props;

  return (
    <p className="equation">
      <span>D = </span>
      <span className="fraction">
        <span className="numerator">1329</span>
        <span className="denominator">
          <span className="square-root">
            <span className="color">{albedo || 'p'}</span>
          </span>
        </span>
      </span>
      <span>
        <span> 10 </span>
        <span className="exponent">
          -0.2 * <span className="color">{magnitude || 'H'}</span>
        </span>
      </span>
      <span>= </span>
      <span className="color">{diameter || '?'}</span>
    </p>
  );
}

FindDiameter.propTypes = {
  diameter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  magnitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  albedo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
