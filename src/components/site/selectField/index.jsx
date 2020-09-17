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
      block,
      fullWidth,
      sameWidth,
      simplifiedMenu,
      value,
      menuItems,
      onChange,
      label,
      style,
      className,
      position,
      minBottom,
      listStyle,
      centered,
      listZDepth,
    } = this.props;

    const positions = {
      'top left': SelectField.Positions.TOP_LEFT,
      'top right': SelectField.Positions.TOP_RIGHT,
      'bottom left': SelectField.Positions.BOTTOM_LEFT,
      'bottom right': SelectField.Positions.BOTTOM_RIGHT,
      below: SelectField.Positions.BELOW,
    };

    return (
      <div className={`md-select-container ${styles.mdSelectContainer}`}>
        <SelectField
          {...{
            dropdownIcon,
            id,
            placeholder,
            disabled,
            block,
            fullWidth,
            sameWidth,
            simplifiedMenu,
            value,
            menuItems,
            onChange,
            label,
            style,
            className,
            minBottom,
            listStyle,
            centered,
            listZDepth,
          }}
          position={positions[position]}
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
  block: PropTypes.bool,
  fullWidth: PropTypes.bool,
  sameWidth: PropTypes.bool,
  simplifiedMenu: PropTypes.bool,
  value: PropTypes.string,
  menuItems: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  onChange: PropTypes.func,
  label: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
  position: PropTypes.string,
  minBottom: PropTypes.number,
  listStyle: PropTypes.object,
  centered: PropTypes.bool,
  listZDepth: PropTypes.number,
};

export default Select;
