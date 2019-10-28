import React from 'react';
import PropTypes from 'prop-types';

class Select extends React.PureComponent {
  render() {
    const {
      id,
      options,
      label,
      name,
      value,
      placeholder,
      handleChange,
      handleBlur,
      className,
      disabled,
      showLabel,
    } = this.props;

    return (
      <div className={`select ${className}`}>
        {showLabel && <label htmlFor={`select-${id}`}>{label}</label>}
        <div className="select-wrapper">
          <select
            id={`select-${id}`}
            name={name}
            value={value}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-label={label}
            disabled={disabled || false}
            multiple={false}
          >
            {placeholder && (
              <option key="placeholder-option" value="DEFAULT" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option, i) => {
              const type = typeof option;
              if (type === 'object') {
                return (
                  <option
                    key={option.id || `option-${i}`}
                    value={option.value}
                    label={option.label}
                  >
                    {option.label}
                  </option>
                );
              }

              return (
                <option key={option} value={option} label={option}>
                  {option}
                </option>
              );
            })}
          </select>
          <hr />
        </div>
      </div>
    );
  }
}

Select.propTypes = {
  id: PropTypes.string,
  options: PropTypes.array,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  showLabel: PropTypes.bool,
};

export default Select;
