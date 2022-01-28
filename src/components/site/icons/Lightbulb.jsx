import React from 'react';
import SVGIcon from 'react-md/lib/SVGIcons/SVGIcon';
import './icon.module.scss';

const Lightbulb = props => (
  <SVGIcon {...props} role="presentation">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" />
  </SVGIcon>
);

export default Lightbulb;
