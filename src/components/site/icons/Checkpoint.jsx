/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const Checkpoint = props => (
  <SVGIcon {...props} role="presentation" viewBox="87 87 26 26">
    <circle fill="#d9f7f6" cx="100" cy="100" r="13" />
    <path
      fill="#ed4c4c"
      d="M 101.965 97.031 L 98.838 93.378 C 99.205 92.574 99.367 91.692 99.309 90.811 L 91.8 96.067 C 92.61 96.424 93.496 96.574 94.378 96.504 L 96.731 100.685 C 96.183 102.007 96.123 103.481 96.563 104.843 L 105.922 98.286 C 104.794 97.411 103.391 96.966 101.965 97.031 Z"
    />
    <polygon
      fill="#8a8c8c"
      points="100.576 102.03 103.994 106.905 106.011 106.961 101.898 101.1 100.576 102.03"
    />
  </SVGIcon>
);

export default Checkpoint;
