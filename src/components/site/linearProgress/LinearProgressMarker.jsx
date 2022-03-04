import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const LinearProgressMarker = ({
  progress,
  completed,
  hoverable,
  filled,
  children,
  style,
}) => (
  <div
    className={classnames('progress-linear-marker', {
      completed,
      hoverable,
      filled,
    })}
    style={{ left: `${progress}%`, ...style }}
  >
    {children}
  </div>
);

LinearProgressMarker.propTypes = {
  progress: PropTypes.number,
  completed: PropTypes.bool,
  hoverable: PropTypes.bool,
  filled: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.object,
};

export default LinearProgressMarker;
