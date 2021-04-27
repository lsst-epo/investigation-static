import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const Checkmark = props => (
  <SVGIcon {...props} role="presentation" viewBox="0 0 127 127">
    <path
      fill="#fff"
      d="M63.5,0A63.5,63.5,0,1,0,127,63.5,63.5,63.5,0,0,0,63.5,0Z"
    />
    <path
      fill="#1f2121"
      d="M54.88,94.5,30.66,67.64,44.71,55,56,67.51l29.27-27.4L98.22,53.92Z"
    />
  </SVGIcon>
);

export default Checkmark;
