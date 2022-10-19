import React, { useState, useEffect } from 'react';
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
} from './hubble-plot.module.scss';

const Nudge = ({
  show,
  mouseDownCallback,
  mouseUpCallback,
  xValueAccessor,
  yValueAccessor,
  xScale,
  yScale,
  data,
  offsetTop,
  chartScale,
}) => {
  const [timer, setTimer] = useState();
  const [pressing, setPressing] = useState(false);
  const [direction, setDirection] = useState();
  const [datum] = data || [];
  const { [xValueAccessor]: datumX, [yValueAccessor]: datumY } = datum || {};

  const opacity = show ? 1 : 0;
  const left = `${xScale(datumX) * chartScale}px`;
  const top = `${(yScale(datumY) + offsetTop) * chartScale}px`;

  useEffect(() => {
    if (pressing && direction) {
      mouseDownCallback(direction);
      const interval = setInterval(() => mouseDownCallback(direction), 100);
      setTimer(interval);
    } else {
      clearInterval(timer);
      mouseUpCallback();
    }
  }, [pressing]);

  const handlePressingDown = clickDirection => {
    setPressing(true);
    setDirection(clickDirection);
  };

  const handleNotPressingDown = () => {
    setPressing(false);
  };

  return (
    <div className={nudgeContainer} style={{ opacity, left, top }}>
      <Button
        icon
        iconEl={<ButtonIcon srText="Up" Icon={ArrowLeft} />}
        className={classNames(nudge, nudgeUp)}
        onMouseDown={() => handlePressingDown('ArrowUp')}
        onMouseUp={handleNotPressingDown}
        onMouseLeave={handleNotPressingDown}
        disabled={!show}
      />
      <Button
        icon
        iconEl={<ButtonIcon srText="Right" Icon={ArrowRight} />}
        className={classNames(nudge, nudgeRight)}
        onMouseDown={() => handlePressingDown('ArrowRight')}
        onMouseUp={handleNotPressingDown}
        onMouseLeave={handleNotPressingDown}
        disabled={!show}
      />
      <Button
        icon
        iconEl={<ButtonIcon srText="Down" Icon={ArrowRight} />}
        className={classNames(nudge, nudgeDown)}
        onMouseDown={() => handlePressingDown('ArrowDown')}
        onMouseUp={handleNotPressingDown}
        onMouseLeave={handleNotPressingDown}
        disabled={!show}
      />
      <Button
        icon
        iconEl={<ButtonIcon srText="Left" Icon={ArrowLeft} />}
        className={classNames(nudge, nudgeLeft)}
        onMouseDown={() => handlePressingDown('ArrowLeft')}
        onMouseUp={handleNotPressingDown}
        onMouseLeave={handleNotPressingDown}
        disabled={!show}
      />
    </div>
  );
};

Nudge.defaultProps = {
  chartScale: 1,
};

Nudge.propTypes = {
  show: PropTypes.bool,
  mouseDownCallback: PropTypes.func,
  mouseUpCallback: PropTypes.func,
  offsetTop: PropTypes.number,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  data: PropTypes.array,
  chartScale: PropTypes.number,
};

export default Nudge;
