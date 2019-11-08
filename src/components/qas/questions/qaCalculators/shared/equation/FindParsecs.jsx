import React from 'react';
import PropTypes from 'prop-types';

export default function FindParsecs(props) {
  const { solution, equation, variable, numerator, denominator } = props;

  return (
    <p className="equation">
      {solution} = {equation}
      <span className="exponent fraction">
        <span className="numerator">
          (<span className="color">{variable}</span>
          {numerator})
        </span>
        <span className="denominator">{denominator}</span>
      </span>
    </p>
  );
}

FindParsecs.propTypes = {
  solution: PropTypes.string,
  equation: PropTypes.string,
  variable: PropTypes.string || PropTypes.number,
  numerator: PropTypes.string || PropTypes.number,
  denominator: PropTypes.string || PropTypes.number,
};
