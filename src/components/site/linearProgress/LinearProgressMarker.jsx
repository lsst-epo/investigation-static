import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const LinearProgressMarker = ({ progress, completed, hoverable, children }) => (
  <div
    className={classnames('progress-linear-marker', { completed, hoverable })}
    style={{ left: `${progress}%` }}
  >
    {children}
  </div>
);

LinearProgressMarker.propTypes = {
  progress: PropTypes.number,
  completed: PropTypes.bool,
  hoverable: PropTypes.bool,
  children: PropTypes.node,
};

export default LinearProgressMarker;
