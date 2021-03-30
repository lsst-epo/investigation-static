/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { formatValue } from '../../../lib/utilities.js';
import {
  playbackSpeedTitle,
  playbackSpeedSliderHeader,
  playbackSpeedSlider,
  playbackSpeedSliderLabel,
  elapsedTimeContainer,
  elapsedTimeInner,
  elapsedTimeTitle,
  elapsedTimeDivider,
  elapsedTimeBlock,
  elapsedVal,
  elapsedLabel,
} from './orbital-viewer.module.scss';

function PlaybackSpeed({
  dayPerVizSec,
  elapsedTime,
  sliderOnChangeCallback,
  speedWords,
  speeds,
}) {
  function formatElapsed(type, value) {
    const sign = elapsedTime < 0 ? '-' : '';
    const years = Math.abs(elapsedTime) / 365.256;
    const justYears = Math.floor(years);
    const justDays = 365.256 * (years - justYears);
    let formattedYears = {};
    let formattedDays = {};

    if (justYears > 1) {
      formattedYears = {
        number: `${sign}${formatValue(justYears)}`,
        string: `Year${justYears >= 2 ? 's' : ''}`,
      };
    } else {
      formattedYears = {
        number: 0,
        string: 'Years',
      };
    }

    if (justDays > 1) {
      formattedDays = {
        number: `${sign}${formatValue(justDays)}`,
        string: `Day${justDays >= 2 ? 's' : ''}`,
      };
    } else {
      formattedDays = {
        number: 0,
        string: 'Days',
      };
    }

    if (type === 'days') return formattedDays[value];
    if (type === 'years') return formattedYears[value];

    return null;
  }

  return (
    <>
      <div className={playbackSpeedSliderHeader}>
        <h4 className={playbackSpeedTitle}>Time Step</h4>
        <div className={playbackSpeedSliderLabel}>
          1 sec = {speedWords[dayPerVizSec]}
        </div>
      </div>
      <input
        className={playbackSpeedSlider}
        type="range"
        min="0"
        max="4"
        step="1"
        value={speeds.indexOf(dayPerVizSec)}
        onChange={sliderOnChangeCallback}
      />
      <div className={elapsedTimeContainer}>
        <div className={elapsedTimeTitle}>Elapsed Time</div>
        <div className={elapsedTimeInner}>
          <div className={elapsedTimeBlock}>
            <div className={elapsedVal}>{formatElapsed('years', 'number')}</div>
            <div className={elapsedLabel}>
              {formatElapsed('years', 'string')}
            </div>
          </div>
          <div className={elapsedTimeDivider}></div>
          <div className={elapsedTimeBlock}>
            <div className={elapsedVal}>{formatElapsed('days', 'number')}</div>
            <div className={elapsedLabel}>
              {formatElapsed('days', 'string')}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

PlaybackSpeed.propTypes = {
  dayPerVizSec: PropTypes.number,
  elapsedTime: PropTypes.number,
  speedWords: PropTypes.object,
  speeds: PropTypes.array,
  sliderOnChangeCallback: PropTypes.func,
};

export default PlaybackSpeed;
