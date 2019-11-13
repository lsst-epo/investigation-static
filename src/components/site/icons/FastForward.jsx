/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const FastForward = props => (
  <SVGIcon {...props} role="presentation">
    <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SVGIcon>
);

export default FastForward;
