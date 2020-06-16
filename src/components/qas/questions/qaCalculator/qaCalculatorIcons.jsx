/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { renderDef } from '../../../../lib/utilities';
import { icon } from './qaCalculator.module.scss';

export const QACalculatorIcon = ({ content }) => {
  return <span className={icon} dangerouslySetInnerHTML={renderDef(content)} />;
};

QACalculatorIcon.propTypes = {
  content: PropTypes.string,
};

export const QACalculatorIconUnit = ({ unit }) => {
  return <span className={icon} dangerouslySetInnerHTML={renderDef(unit)} />;
};

QACalculatorIconUnit.propTypes = {
  unit: PropTypes.string,
};
