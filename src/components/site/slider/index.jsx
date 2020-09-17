import Slider from 'react-md/lib/Sliders/Slider';
import React from 'react';
import PropTypes from 'prop-types';
import './styles.module.scss';

class SliderCustom extends React.PureComponent {
  render() {
    const {
      id,
      className,
      disabled,
      thumbStyle,
      onChange,
      label,
      style,
      discrete,
      value,
      defaultValue,
    } = this.props;
    return (
      <Slider
        {...{
          id,
          className,
          disabled,
          onChange,
          label,
          thumbStyle,
          style,
          discrete,
          value,
          defaultValue,
        }}
      />
    );
  }
}

SliderCustom.defaultProps = {
  discrete: false,
};

SliderCustom.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  thumbStyle: PropTypes.object,
  onChange: PropTypes.func,
  label: PropTypes.node,
  style: PropTypes.object,
  discrete: PropTypes.bool,
  value: PropTypes.number,
  defaultValue: PropTypes.number,
};

export default SliderCustom;
