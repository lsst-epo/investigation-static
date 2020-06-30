import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import Orbital from './Orbital.jsx';
import { earth, jupiter, neptune } from './orbitalUtilities.js';

function Orbitals({
  neos,
  activeNeo,
  selectionCallback,
  activeVelocityCallback,
  playing,
  dayPerVizSec,
  stepDirection,
  frameOverride,
  includeRefObjs,
}) {
  function reducer(state) {
    const { remainingInits } = state;
    return { remainingInits: remainingInits - 1 };
  }

  const [state, dispatch] = useReducer(reducer, {
    remainingInits: neos.length,
  });

  function renderRefObjs() {
    return [earth, jupiter, neptune].map(planet => {
      const {
        orbitColor,
        objectColor,
        objectRadius,
        Ref: ref,
        Principal_desig: pd,
      } = planet;

      return (
        <Orbital
          key={ref + pd}
          data={planet}
          position={[0, 0, 0]}
          {...{
            playing,
            stepDirection,
            dayPerVizSec,
            frameOverride,
            selectionCallback,
            orbitColor,
            objectColor,
            objectRadius,
          }}
        />
      );
    });
  }

  return (
    <>
      {includeRefObjs && renderRefObjs()}
      {neos.map(neo => {
        const { Ref: ref, Principal_desig: pd } = neo;

        return (
          <Orbital
            key={ref + pd}
            data={neo}
            position={[0, 0, 0]}
            active={neo === activeNeo}
            initialized={state.remainingInits <= 0}
            {...{
              playing,
              stepDirection,
              dayPerVizSec,
              frameOverride,
              selectionCallback,
              activeVelocityCallback,
            }}
            initCallback={dispatch}
          />
        );
      })}
    </>
  );
}

Orbitals.propTypes = {
  neos: PropTypes.array,
  activeNeo: PropTypes.object,
  selectionCallback: PropTypes.func,
  playing: PropTypes.bool,
  dayPerVizSec: PropTypes.number,
  stepDirection: PropTypes.number,
  frameOverride: PropTypes.number,
  includeRefObjs: PropTypes.bool,
  activeVelocityCallback: PropTypes.func,
};

export default Orbitals;
