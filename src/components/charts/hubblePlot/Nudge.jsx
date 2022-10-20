import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../site/button';
import ButtonIcon from '../../site/button/ButtonIcon';
import ArrowLeft from '../../site/icons/ArrowLeft';
import ArrowRight from '../../site/icons/ArrowRight';
import {
  nudgeContainer,
  nudgeRight,
  nudgeLeft,
  nudgeDown,
  nudgeUp,
  nudge,
  nudgeFiller,
} from './hubble-plot.module.scss';

const Nudge = ({
  show,
  arrowDownCallback,
  arrowUpCallback,
  xValueAccessor,
  yValueAccessor,
  xScale,
  yScale,
  data,
  offsetTop,
}) => {
  const width = 80;
  const arrows = [
    { icon: ArrowLeft, key: 'ArrowUp', cssClass: nudgeUp, srText: 'Up' },
    {
      icon: ArrowRight,
      key: 'ArrowRight',
      cssClass: nudgeRight,
      srText: 'Right',
    },
    {
      icon: ArrowRight,
      key: 'ArrowDown',
      cssClass: nudgeDown,
      srText: 'Down',
    },
    {
      icon: ArrowLeft,
      key: 'ArrowLeft',
      cssClass: nudgeLeft,
      srText: 'Left',
    },
  ];

  const [timer, setTimer] = useState();
  const [pressing, setPressing] = useState(false);
  const [direction, setDirection] = useState();
  const arrowsRef = useRef();

  const [datum] = data || [];
  const { [xValueAccessor]: datumX, [yValueAccessor]: datumY } = datum || {};
  const opacity = show ? 1 : 0;
  const x = xScale(datumX) - width / 2 || 0;
  const y = yScale(datumY) + offsetTop - width / 2 || 0;

  useEffect(() => {
    if (pressing && direction) {
      arrowDownCallback(direction);
      const interval = setInterval(() => arrowDownCallback(direction), 100);
      setTimer(interval);
    } else {
      clearInterval(timer);
      arrowUpCallback();
    }
  }, [pressing]);

  const handlePressingDown = (event, clickDirection) => {
    const { button } = event;

    if (button === 0) {
      setPressing(true);
      setDirection(clickDirection);
    }
  };

  const handleNotPressingDown = () => {
    setPressing(false);
  };

  const onKeyDown = event => {
    const { key } = event;

    if (datum && key.includes('Arrow')) {
      arrowDownCallback(key);
    }
  };

  const setEventHandlers = () => {
    const { current: element } = arrowsRef;
    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', arrowUpCallback);
  };

  const removeEventHandlers = () => {
    const { current: element } = arrowsRef;
    element.removeEventListener('keydown', onKeyDown);
    element.removeEventListener('keyup', arrowUpCallback);
  };

  return (
    <foreignObject {...{ x, y, width }} height={width}>
      <div
        className={nudgeContainer}
        style={{ opacity }}
        onFocus={setEventHandlers}
        onBlur={removeEventHandlers}
        ref={arrowsRef}
      >
        {arrows.map(arrow => {
          const { icon: Icon, key, cssClass, srText } = arrow;

          return (
            <Button
              key={key}
              icon
              iconEl={<ButtonIcon {...{ Icon, srText }} />}
              className={classNames(nudge, cssClass)}
              onMouseDown={e => handlePressingDown(e, key)}
              onMouseUp={handleNotPressingDown}
              onMouseLeave={handleNotPressingDown}
              disabled={!show}
            />
          );
        })}
        <div className={nudgeFiller} />
      </div>
    </foreignObject>
  );
};

Nudge.propTypes = {
  show: PropTypes.bool,
  arrowDownCallback: PropTypes.func,
  arrowUpCallback: PropTypes.func,
  offsetTop: PropTypes.number,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  data: PropTypes.array,
  chartScale: PropTypes.number,
};

export default Nudge;
