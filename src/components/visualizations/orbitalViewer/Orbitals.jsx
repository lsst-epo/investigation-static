import React from 'react';
import PropTypes from 'prop-types';
import Orbital from './Orbital.jsx';

function Orbitals({
  neos,
  activeNeo,
  selectionCallback,
  playing,
  stepsPerFrame,
  stepDirection,
  frameOverride,
}) {
  return neos.map(neo => {
    const { Ref: ref, Principal_desig: pd } = neo;

    return (
      <Orbital
        key={ref + pd}
        data={neo}
        position={[0, 0, 0]}
        active={neo === activeNeo}
        {...{
          selectionCallback,
          playing,
          stepsPerFrame,
          stepDirection,
          frameOverride,
        }}
      />
    );
  });
}

Orbitals.propTypes = {
  neos: PropTypes.array,
  activeNeo: PropTypes.object,
  selectionCallback: PropTypes.func,
  playing: PropTypes.bool,
  stepsPerFrame: PropTypes.number,
  stepDirection: PropTypes.number,
  frameOverride: PropTypes.number,
};

export default Orbitals;
