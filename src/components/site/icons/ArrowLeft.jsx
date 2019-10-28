/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';

const ArrowLeft = props => (
  <SVGIcon {...props} role="presentation">
    <path fill="none" d="M0 0h24v24H0V0z" />
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </SVGIcon>
);

export default ArrowLeft;
