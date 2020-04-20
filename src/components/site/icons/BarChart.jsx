/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const BarChart = props => (
  <SVGIcon {...props} role="presentation">
    <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SVGIcon>
);

export default BarChart;
