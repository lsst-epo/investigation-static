import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { verticalSlider } from './styles.module.scss';

const SliderVertical = ({
  min,
  max,
  step,
  value,
  disabled,
  id,
  className,
  changeCallback,
}) => {
  return (
    <input
      className={classNames(verticalSlider, className)}
      type="range"
      onChange={changeCallback}
      value={value}
      {...{ min, max, step, disabled, id }}
    />
  );
};

SliderVertical.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  changeCallback: PropTypes.func,
  value: PropTypes.number,
};

export default SliderVertical;
