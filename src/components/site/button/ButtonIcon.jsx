import React from 'react';
import PropTypes from 'prop-types';

const ButtonIcon = ({ srText, Icon }) => (
  <>
    <Icon />
    {srText && <span className="screen-reader-only">{srText}</span>}
  </>
);

ButtonIcon.propTypes = {
  srText: PropTypes.string,
  Icon: PropTypes.func,
};

export default ButtonIcon;
