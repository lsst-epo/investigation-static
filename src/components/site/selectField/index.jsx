import React from 'react';
import PropTypes from 'prop-types';
import { SelectField } from 'react-md';
import styles from './styles.module.scss';

class Select extends React.PureComponent {
  render() {
    const {
      dropdownIcon,
      id,
      placeholder,
      disabled,
      fullWidth,
      value,
      menuItems,
      onChange,
      label,
      style,
      className,
    } = this.props;
    return (
      <div className={styles.mdSelectContainer}>
        <SelectField
          {...{
            dropdownIcon,
            id,
            placeholder,
            disabled,
            fullWidth,
            value,
            menuItems,
            onChange,
            label,
            style,
            className,
          }}
        />
      </div>
    );
  }
}

Select.propTypes = {
  dropdownIcon: PropTypes.object,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  value: PropTypes.string,
  menuItems: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  onChange: PropTypes.func,
  label: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Select;
