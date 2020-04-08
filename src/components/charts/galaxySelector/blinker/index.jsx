import React from 'react';
import PropTypes from 'prop-types';
import BlinkerImages from './BlinkerImages';
import BlinkerControls from './BlinkerControls';

const Blinker = ({
  images,
  activeId,
  playing,
  handleStartStop,
  handleNext,
  handlePrevious,
}) => {
  return (
    <>
      <BlinkerImages images={images} activeId={activeId} />
      <BlinkerControls
        playing={playing}
        handleStartStop={handleStartStop}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    </>
  );
};

Blinker.propTypes = {
  images: PropTypes.array.isRequired,
  activeId: PropTypes.number,
  playing: PropTypes.bool,
  handleStartStop: PropTypes.func,
  handleNext: PropTypes.func,
  handlePrevious: PropTypes.func,
};

export default Blinker;
