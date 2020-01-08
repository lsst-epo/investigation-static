/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const ViewList = props => (
  <SVGIcon {...props} role="presentation">
    <svg>
      <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  </SVGIcon>
);

export default ViewList;
