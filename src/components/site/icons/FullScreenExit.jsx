import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const FullscreenExit = props => (
  <SVGIcon {...props} role="presentation">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
  </SVGIcon>
);

export default FullscreenExit;
