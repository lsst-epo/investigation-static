import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import {
  getMinorAxis,
  auToUnit,
  degsToRads,
  getFocus,
  getCurve,
} from './orbitalUtilities.js';

const PotentialOrbits = ({ data }) => {
  function convert2dTo3d(vector2D, orbitData) {
    const { i, Peri: peri, Node: ascendingNode } = orbitData;
    const yAxisOfRotation = new THREE.Vector3(0, 1, 0);
    const zAxisOfRotation = new THREE.Vector3(0, 0, 1);

    return new THREE.Vector3(vector2D.x, vector2D.y, 0)
      .applyAxisAngle(zAxisOfRotation, peri ? degsToRads(peri + 90) : 0)
      .applyAxisAngle(yAxisOfRotation, degsToRads(i))
      .applyAxisAngle(
        zAxisOfRotation,
        ascendingNode ? degsToRads(ascendingNode) : 0
      );
  }

  function getCurveVectors(majAxis, minAxis, orbitData) {
    const focus = getFocus(majAxis, minAxis);
    const offsetCenter = new THREE.Vector3(focus, 0, 0);

    return getCurve(majAxis, minAxis, offsetCenter.x, offsetCenter.y)
      .getPoints(100)
      .map(vector2D => {
        return convert2dTo3d(vector2D, orbitData);
      })
      .flat();
  }

  function getCurvesVectors(orbitsData) {
    return orbitsData.map(d => {
      const { a, e } = d;
      const majAxis = auToUnit(a);
      const minAxis = getMinorAxis(a, e);

      return getCurveVectors(majAxis, minAxis, d);
    });
  }

  const [potentialsGeometry] = useState(() => {
    let transI = 0;
    const indicies = [];
    const vertices = [];

    getCurvesVectors(data).forEach(vectors => {
      const stopIndex = vectors.length - 1;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < vectors.length; i++) {
        const vector = vectors[i];
        const offsetIndex = i + transI;

        // add vectors to vertices array
        vertices.push(vector.x);
        vertices.push(vector.y);
        vertices.push(vector.z);
        // add indicies to draw line between current vertice and the next one
        indicies.push(offsetIndex);
        indicies.push(i === stopIndex ? transI : offsetIndex + 1);
      }

      transI += vectors.length;
    });

    const bufferGeom = new THREE.BufferGeometry();
    const typesPos = new THREE.Float32BufferAttribute(vertices, 3);
    bufferGeom.setAttribute('position', typesPos);
    bufferGeom.setIndex(indicies);

    return bufferGeom;
  });

  return (
    <lineSegments position={[0, 0, 0]} geometry={potentialsGeometry}>
      <lineBasicMaterial attach="material" color="pink" />
    </lineSegments>
  );
};

PotentialOrbits.propTypes = {
  data: PropTypes.array,
};

export default PotentialOrbits;
