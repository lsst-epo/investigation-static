import React from 'react';
import PropTypes from 'prop-types';
import Star from '../../../site/icons/Star';

const StarAvatar = ({ classes, content }) => (
  <span>
    <Star className={classes} />
    <span className="screen-reader-only">{content}</span>
  </span>
);

StarAvatar.propTypes = {
  classes: PropTypes.string,
  content: PropTypes.string,
};

export default StarAvatar;
