/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const Pause = props => (
  <SVGIcon {...props} role="presentation">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SVGIcon>
);

export default Pause;
