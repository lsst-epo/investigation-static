/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import Parsecs from './Parsecs';
import MegaParsecs from './MegaParsecs';
import LightYears from './LightYears';
import MegaLightYears from './MegaLightYears';
import KeyValue from './KeyValue';
import './calculation.module.scss';

const calcComponents = {
  Parsecs,
  MegaParsecs,
  LightYears,
  MegaLightYears,
};

class Calculation extends React.PureComponent {
  render() {
    const { component } = this.props;
    const Calc = calcComponents[component];
    return (
      <div className="calculation-block">
        {Calc ? <Calc {...this.props} /> : <KeyValue {...this.props} />}
      </div>
    );
  }
}

Calculation.propTypes = {
  component: PropTypes.string,
};

export default Calculation;
