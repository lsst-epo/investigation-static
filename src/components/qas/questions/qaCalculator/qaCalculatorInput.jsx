/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '../../../site/forms/textField';

function QACalculatorInput({
  containerWidth,
  id,
  className,
  type,
  min,
  leftIcon,
  rightIcon,
  label,
  lineDirection,
  placeholder,
  defaultValue,
  onBlur,
  onFocus,
  onChange,
  disabled,
}) {
  return (
    <div className={containerWidth}>
      <TextField
        {...{
          id,
          className,
          type,
          min,
          leftIcon,
          rightIcon,
          label,
          lineDirection,
          placeholder,
          defaultValue,
          onBlur,
          onFocus,
          onChange,
          disabled,
        }}
      />
    </div>
  );
}

QACalculatorInput.defaultProps = {
  lineDirection: 'center',
  type: 'number',
  min: '0',
};

QACalculatorInput.propTypes = {
  containerWidth: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  min: PropTypes.string,
  leftIcon: PropTypes.object,
  rightIcon: PropTypes.object,
  label: PropTypes.string,
  lineDirection: PropTypes.string,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default QACalculatorInput;
