import React from 'react';
import PropTypes from 'prop-types';

const Switch = ({ id, checked, onClick, leftLabel, rightLabel }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={onClick}
      className="switch"
    >
      <div className="switch-toggle" aria-hidden></div>
      <div className="switch-labels" aria-hidden>
        <span className="switch-label switch-label-left">{leftLabel}</span>
        <span className="switch-label switch-label-right">{rightLabel}</span>
      </div>
    </button>
  );
};

Switch.propTypes = {
  id: PropTypes.string,
  checked: PropTypes.bool,
  onClick: PropTypes.func,
  leftLabel: PropTypes.string,
  rightLabel: PropTypes.string,
};

export default Switch;
