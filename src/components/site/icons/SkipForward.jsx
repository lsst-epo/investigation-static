/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const SkipForward = props => (
  <SVGIcon {...props} role="presentation">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
  </SVGIcon>
);

export default SkipForward;
