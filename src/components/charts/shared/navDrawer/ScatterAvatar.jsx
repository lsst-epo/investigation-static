import React from 'react';
import PropTypes from 'prop-types';
import ScatterPlot from '../../../site/icons/ScatterPlot';

const StarAvatar = ({ classes, content }) => (
  <span>
    <ScatterPlot className={classes} />
    <span className="screen-reader-only">{content}</span>
  </span>
);

StarAvatar.propTypes = {
  classes: PropTypes.string,
  content: PropTypes.string,
};

export default StarAvatar;
