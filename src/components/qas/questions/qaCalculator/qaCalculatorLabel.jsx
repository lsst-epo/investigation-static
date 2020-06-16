/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { renderDef } from '../../../../lib/utilities';

function QACalculatorLabel({ label, labelClasses }) {
  return (
    <div className={labelClasses} dangerouslySetInnerHTML={renderDef(label)} />
  );
}

QACalculatorLabel.propTypes = {
  label: PropTypes.string,
  labelClasses: PropTypes.string,
};

export default QACalculatorLabel;
