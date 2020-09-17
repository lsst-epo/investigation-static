import React from 'react';
import PropTypes from 'prop-types';
import { colorSwatch, largeSwatch } from './color-tool.module.scss';

const ColorSwatch = ({ classes, content, color, large }) => (
  <span className={classes}>
    <span
      className={`${colorSwatch}${large ? ` ${largeSwatch}` : ''}`}
      style={{ backgroundColor: color }}
    ></span>
    <span className="screen-reader-only">{content || color}</span>
  </span>
);

ColorSwatch.defaultProps = {
  large: false,
};

ColorSwatch.propTypes = {
  classes: PropTypes.string,
  content: PropTypes.string,
  color: PropTypes.string,
  large: PropTypes.bool,
};

export default ColorSwatch;
