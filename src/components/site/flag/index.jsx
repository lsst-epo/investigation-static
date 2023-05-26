import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { flagWrapper, flagBody, flagTail } from './flag.module.scss';

function Flag({ className, children, color }) {
  return (
    <div
      className={classnames(className, flagWrapper)}
      style={{ '--background-color': color }}
    >
      <div className={flagBody}>{children}</div>
      <svg
        className={flagTail}
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        viewBox="0 0 100 24.551"
      >
        <defs>
          <filter id="Subtraction_6" x="0" y="0" filterUnits="userSpaceOnUse">
            {/* eslint-disable-next-line react/no-unknown-property */}
            <feOffset dy="1" input="SourceAlpha" />
            <feGaussianBlur result="blur" />
            <feFlood floodOpacity="0.059" />
            <feComposite operator="in" in2="blur" />
            <feComposite in="SourceGraphic" />
          </filter>
        </defs>
        <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Subtraction_6)">
          <path
            d="M100,120h0L50,96.587,0,120V96.449H100V120Z"
            transform="translate(0 -96.45)"
          />
        </g>
      </svg>
    </div>
  );
}

Flag.displayName = 'Atomic.Flag';

Flag.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default Flag;
