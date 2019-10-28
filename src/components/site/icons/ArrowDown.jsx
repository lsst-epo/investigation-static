/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';

const ArrowDown = props => (
  <SVGIcon {...props} role="presentation">
    <path d="M7 10l5 5 5-5z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SVGIcon>
);

export default ArrowDown;
