import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useThree, useFrame } from 'react-three-fiber';
import Orbital from './Orbital.jsx';
import PotentialOrbits from './PotentialOrbits.jsx';
import { getRefObjProps } from './orbitalUtilities.js';

function Orbitals({
  neos,
  activeNeo,
  activeObs,
  selectionCallback,
  activeVelocityCallback,
  playing,
  dayPerVizSec,
  stepDirection,
  frameOverride,
  defaultZoom,
  potentialOrbits,
  observations,
  refObjs,
}) {
  function reducer(state) {
    const { remainingInits } = state;
    return { remainingInits: remainingInits - 1 };
  }

  const { camera } = useThree();
  const [state, dispatch] = useReducer(reducer, {
    remainingInits: neos.length,
  });

  const [zoomLevel, setZoomLevel] = useState(1);

  useFrame(() => {
    if (camera.zoom !== zoomLevel) setZoomLevel(camera.zoom);
  });

  function renderRefObjs() {
    const refObjsProperties = (refObjs || ['earth', 'jupiter', 'neptune']).map(
      refObjId => {
        return getRefObjProps(refObjId);
      }
    );
    return refObjsProperties.map(planet => {
      const {
        orbitColor,
        objectColor,
        objectRadius,
        Ref: ref,
        Principal_desig: pd,
      } = planet;

      return (
        <Orbital
          type="planet"
          key={ref + pd}
          data={planet}
          position={[0, 0, 0]}
          zoomMod={zoomLevel}
          {...{
            defaultZoom,
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
      {renderRefObjs()}
      {potentialOrbits ? (
        <PotentialOrbits
          data={neos}
          position={[0, 0, 0]}
          initialized
          zoomMod={zoomLevel}
          {...{
            defaultZoom,
            playing,
            stepDirection,
            dayPerVizSec,
            frameOverride,
            selectionCallback,
            activeVelocityCallback,
            observations,
            activeObs,
          }}
          initCallback={dispatch}
        />
      ) : (
        neos.map((neo, badId) => {
          const { Ref: ref, Principal_desig: pd } = neo;
          return (
            <Orbital
              key={ref && pd ? ref + pd : `orbit-${badId}`}
              data={neo}
              position={[0, 0, 0]}
              active={neo === activeNeo}
              initialized={state.remainingInits <= 0}
              zoomMod={zoomLevel}
              {...{
                defaultZoom,
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
        })
      )}
    </>
  );
}

Orbitals.propTypes = {
  neos: PropTypes.array,
  activeNeo: PropTypes.object,
  activeObs: PropTypes.object,
  selectionCallback: PropTypes.func,
  playing: PropTypes.bool,
  dayPerVizSec: PropTypes.number,
  stepDirection: PropTypes.number,
  frameOverride: PropTypes.number,
  activeVelocityCallback: PropTypes.func,
  defaultZoom: PropTypes.number,
  potentialOrbits: PropTypes.bool,
  observations: PropTypes.array,
  refObjs: PropTypes.array,
};

export default Orbitals;
