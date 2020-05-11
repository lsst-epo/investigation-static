import React from 'react';
import PropTypes from 'prop-types';
import FindDiameter from './FindDiameter';
import FindDistanceModulus from './FindDistanceModulus';
import FindParsecs from './FindParsecs';
import FindKineticEnergy from './FindKineticEnergy';

export function DefaultEquation(props) {
  const { solution, equation } = props;
  return (
    <p>
      {solution} = {equation}
    </p>
  );
}

DefaultEquation.propTypes = {
  solution: PropTypes.string,
  equation: PropTypes.string,
};

export default function Equation(props) {
  const { component } = props;
  const components = {
    FindDiameter,
    FindDistanceModulus,
    FindParsecs,
    FindKineticEnergy,
  };

  const LoadedComponent = components[component];

  return (
    <>{<LoadedComponent {...props} /> || <DefaultEquation {...props} />}</>
  );
}

Equation.propTypes = {
  component: PropTypes.string,
};
