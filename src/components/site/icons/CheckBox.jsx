/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const CheckBox = props => (
  <SVGIcon {...props} role="presentation">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </SVGIcon>
);

export default CheckBox;
