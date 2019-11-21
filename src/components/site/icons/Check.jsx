/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const Check = props => (
  <SVGIcon {...props} role="presentation">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SVGIcon>
);

export default Check;
