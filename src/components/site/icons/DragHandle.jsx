/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const DragHandle = props => (
  <SVGIcon {...props} role="presentation">
    <svg>
      <defs>
        <path id="a" d="M0 0h24v24H0V0z" />
      </defs>
      <clipPath id="b">
        <use xlinkHref="#a" overflow="visible" />
      </clipPath>
      <path clipPath="url(#b)" d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" />
    </svg>
  </SVGIcon>
);

export default DragHandle;
