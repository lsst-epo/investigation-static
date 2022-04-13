import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withTranslation } from 'gatsby-plugin-react-i18next';
import styles from './select.module.scss';

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
      handleFocus,
      className,
      disabled,
      showLabel,
      inline,
      t,
    } = this.props;

    const classes = classnames(styles.select, className, {
      [styles.inlineSelect]: inline,
    });

    return (
      <div className={classes}>
        {showLabel && <label htmlFor={`select-${id}`}>{t(label)}</label>}
        <div className={styles.selectWrapper}>
          <select
            data-testid="select"
            id={`select-${id}`}
            name={t(name)}
            value={value}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            aria-label={t(label)}
            disabled={disabled || false}
            multiple={false}
          >
            {placeholder && (
              <option key="placeholder-option" value="DEFAULT" disabled>
                {t(placeholder)}
              </option>
            )}
            {options.map((option, i) => {
              const type = typeof option;
              if (type === 'object') {
                return (
                  <option
                    key={option.id || `option-${i}`}
                    value={option.value}
                    label={t(option.label)}
                  >
                    {t(option.label)}
                  </option>
                );
              }

              return (
                <option key={option} value={option} label={t(option)}>
                  {t(option)}
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
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleFocus: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  showLabel: PropTypes.bool,
  inline: PropTypes.bool,
  t: PropTypes.func,
};

export default withTranslation()(Select);
