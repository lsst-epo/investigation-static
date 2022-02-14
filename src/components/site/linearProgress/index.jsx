import React from 'react';
import PropTypes from 'prop-types';
import LinearProgressMarker from './LinearProgressMarker';

const LinearProgress = ({ min, max, value, id, labelledById, children }) => (
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
    <LinearProgressMarker completed hoverable progress={value}>
      <span className="progress-linear-hover-text">{`${value}%`}</span>
    </LinearProgressMarker>
    {children}
  </div>
);

LinearProgress.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  id: PropTypes.string,
  labelledById: PropTypes.string,
  children: PropTypes.node,
};

LinearProgress.defaultProps = {
  min: 0,
  max: 100,
};

export default LinearProgress;
