import React from 'react';
import PropTypes from 'prop-types';

const LinearProgress = ({ min, max, value, id, labelledById }) => (
  <div className="progress-linear-container" id={id}>
    <div
      className="progress-linear"
      role="progressbar"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-labelledby={labelledById}
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

LinearProgress.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  id: PropTypes.string,
  labelledById: PropTypes.string,
};

LinearProgress.defaultProps = {
  min: 0,
  max: 100,
};

export default LinearProgress;
