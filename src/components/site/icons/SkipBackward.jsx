/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const SkipBackward = props => (
  <SVGIcon {...props} role="presentation">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6l-8.5 6zm6.5 2.14L12.97 12 16 9.86v4.28z" />
  </SVGIcon>
);

export default SkipBackward;
