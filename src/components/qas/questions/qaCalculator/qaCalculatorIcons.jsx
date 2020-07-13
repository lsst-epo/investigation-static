/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { renderDef } from '../../../../lib/utilities';
import { icon, smallIcon } from './qaCalculator.module.scss';

export const QACalculatorIcon = ({ content, className }) => {
  return (
    <span
      className={classnames(icon, className)}
      dangerouslySetInnerHTML={renderDef(content)}
    />
  );
};

QACalculatorIcon.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
};

export const QACalculatorIconUnit = ({ unit, tiny, className }) => {
  return (
    <span className={classnames(icon, className, { [smallIcon]: !!tiny })}>
      {unit}
    </span>
  );
};

QACalculatorIconUnit.defaultProps = {
  tiny: false,
};

QACalculatorIconUnit.propTypes = {
  unit: PropTypes.oneOfType(PropTypes.string, PropTypes.object),
  tiny: PropTypes.bool,
  className: PropTypes.string,
};
