/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const ScatterPlot = props => (
  <SVGIcon {...props} role="presentation">
    <path fill="none" d="M0 0h24v24H0V0z" />
    <g>
      <circle cx="7" cy="14" r="3" />
      <circle cx="11" cy="6" r="3" />
      <circle cx="16.6" cy="17.6" r="3" />
    </g>
  </SVGIcon>
);

export default ScatterPlot;
