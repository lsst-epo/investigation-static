import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import Observation from './Observation.jsx';
import { getMean } from '../../../lib/utilities.js';
import {
  getMinorAxis,
  auToUnit,
  getFocus,
  getCurve,
  convert2dTo3d,
} from './orbitalUtilities.js';

const Observations = ({ data, observations, activeObs, selectionCallback }) => {
  const [observationsVectors] = useState(() => {
    const a = getMean(data, 'a');
    const e = getMean(data, 'e');
    const i = getMean(data, 'i');
    const Peri = getMean(data, 'Peri');
    const Node = getMean(data, 'Node');

    const meanMajAxis = auToUnit(a);
    const meanMinAxis = getMinorAxis(a, e);
    const focus = getFocus(meanMajAxis, meanMinAxis);
    const offsetCenter = new THREE.Vector3(focus, 0, 0);
    const curve = getCurve(
      meanMajAxis,
      meanMinAxis,
      offsetCenter.x,
      offsetCenter.y
    );

    return (observations || []).map(obs => {
      const { position } = obs;
      return convert2dTo3d(curve.getPoint(position), { a, e, i, Peri, Node });
    });
  });

  return (
    <>
      {observationsVectors && (
        <>
          {observationsVectors.map((obsVector, i) => {
            const observation = observations[i];
            const { id } = observation;

            return (
              <Observation
                key={id}
                data={observation}
                vector={obsVector}
                {...{ selectionCallback, activeObs }}
              />
            );
          })}
        </>
      )}
    </>
  );
};

Observations.propTypes = {
  data: PropTypes.array,
  observations: PropTypes.array,
  selectionCallback: PropTypes.func,
  activeObs: PropTypes.object,
};

export default Observations;
