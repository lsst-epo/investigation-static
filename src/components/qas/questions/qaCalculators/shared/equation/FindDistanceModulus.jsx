import React from 'react';
import PropTypes from 'prop-types';

export default function FindDistanceModulus(props) {
  const { solution, equation, variable } = props;

  return (
    <p className="equation">
      {solution} = <span className="color">{variable}</span>
      {equation}
    </p>
  );
}

FindDistanceModulus.propTypes = {
  solution: PropTypes.string,
  equation: PropTypes.string,
  variable: PropTypes.string || PropTypes.number,
};
