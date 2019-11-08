/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import FindDistanceModulus from './FindDistanceModulus';
import FindParsecs from './FindParsecs';
import './equation.module.scss';

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
    FindDistanceModulus,
    FindParsecs,
  };

  const LoadedComponent = components[component];

  return (
    <div className="equation--container">
      {<LoadedComponent {...props} /> || <DefaultEquation {...props} />}
    </div>
  );
}

Equation.propTypes = {
  component: PropTypes.string,
};
