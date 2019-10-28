/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';

const ArrowRight = props => (
  <SVGIcon {...props} role="presentation">
    <path fill="none" d="M0 0h24v24H0V0z" />
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
  </SVGIcon>
);

export default ArrowRight;
