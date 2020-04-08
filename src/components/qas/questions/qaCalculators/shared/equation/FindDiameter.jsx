import React from 'react';
import PropTypes from 'prop-types';

export default function FindDiameter(props) {
  const { solution, H, p } = props;

  return (
    <p className="equation">
      <span>D = </span>
      <span className="fraction">
        <span className="numerator">1329</span>
        <span className="denominator">
          <span className="square-root">
            <span className="color">{p}</span>
          </span>
        </span>
      </span>
      <span>
        <span> 10 </span>
        <span className="exponent">
          -0.2 * <span className="color">{H}</span>
        </span>
      </span>
      <span>= </span>
      <span className="color">{solution}</span>
    </p>
  );
}

FindDiameter.propTypes = {
  solution: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  H: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  p: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
