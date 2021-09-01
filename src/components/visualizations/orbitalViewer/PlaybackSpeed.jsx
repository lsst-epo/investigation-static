/* eslint-disable react/no-danger */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { formatValue } from '../../../lib/utilities.js';
import {
  playbackSpeedTitle,
  playbackSpeedSliderHeader,
  playbackSpeedSlider,
  playbackSpeedSliderLabelTop,
  playbackSpeedSliderLabel,
  playbackSpeedSliderLabelBottom,
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
  speeds,
}) {
  function formatSpeed(speed) {
    const years = speed / 365;
    const justYears = Math.floor(years);
    const justDays = 365 * (years - justYears);
    let formattedYears = {};
    let formattedDays = {};

    if (justYears >= 1) {
      formattedYears = {
        number: formatValue(justYears),
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
        number: formatValue(justDays),
        string: `Day${justDays >= 2 ? 's' : ''}`,
      };
    } else {
      formattedDays = {
        number: 0,
        string: 'Days',
      };
    }

    if (justYears >= 1) {
      return `${formattedYears.number} ${formattedYears.string}`;
    }

    if (justDays < 1) {
      return `1 sec`;
    }

    return `${formattedDays.number} ${formattedDays.string}`;
  }

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

  const formattedSpeed = useMemo(() => {
    return formatSpeed(dayPerVizSec);
  }, [dayPerVizSec]);

  return (
    <>
      <div className={playbackSpeedSliderHeader}>
        <h4 className={playbackSpeedTitle}>Time Step</h4>
        <div className={playbackSpeedSliderLabel}>1 sec = {formattedSpeed}</div>
      </div>
      <div className={playbackSpeedSliderLabelTop}>
        1 second
        <br />
        is 1 year
      </div>
      <div className={playbackSpeedSliderLabelBottom}>
        Normal
        <br />
        Time
      </div>
      <input
        className={playbackSpeedSlider}
        type="range"
        min={speeds.min}
        max={speeds.max}
        step={speeds.step}
        value={dayPerVizSec}
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
  speeds: PropTypes.object,
  sliderOnChangeCallback: PropTypes.func,
};

export default PlaybackSpeed;
