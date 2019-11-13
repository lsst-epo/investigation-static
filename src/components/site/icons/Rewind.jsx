/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const Rewind = props => (
  <SVGIcon {...props} role="presentation">
    <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SVGIcon>
);

export default Rewind;
