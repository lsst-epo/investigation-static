/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const Play = props => (
  <SVGIcon {...props} role="presentation">
    <path d="M8 5v14l11-7z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SVGIcon>
);

export default Play;
