import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Unit from '../../charts/shared/unit/index.jsx';
import Table from '../../site/forms/table/index.jsx';
import { getValue, toSigFigs } from '../../../lib/utilities.js';
import {
  details,
  activeDetails,
  detailsToggle,
  detailsTable,
} from './orbital-viewer.module.scss';
import Button from '../../site/button/index.js';

function OrbitalDetails({ data, velocity, type }) {
  const { H, a, i, e, Principal_desig: name, Earth_moid: moid } = data || {};
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (data) setActive(true);
  }, [data]);

  function renderValueWithUnits(value, unitType, showUnit) {
    if (!value) return '';

    return (
      <>
        {getValue(unitType, value)}
        {showUnit && <Unit type={unitType} />}
      </>
    );
  }

  function getRows() {
    if (type === 'hazardous-asteroids') {
      return [
        ['Scientific Name', name || ''],
        ['Absolute Magnitude', renderValueWithUnits(H, 'magnitude', false)],
        ['Earth MOID', renderValueWithUnits(moid, 'moid', true)],
      ];
    }

    return [
      ['Scientific Name', name || ''],
      ['Orbit Size', renderValueWithUnits(a, 'semimajor_axis', true)],
      ['Eccentricity', renderValueWithUnits(e, 'eccentricity', false)],
      ['Inclination', renderValueWithUnits(i, 'inclination', true)],
      [
        'Orbital Speed',
        renderValueWithUnits(toSigFigs(velocity, 3), 'velocity', true),
      ],
    ];
  }

  return (
    <>
      <Button
        className={detailsToggle}
        flat
        disabled={!data}
        onClick={() => setActive(!active)}
      >
        {active ? 'Hide' : 'Object'} info
      </Button>
      <div
        className={classnames(details, {
          [activeDetails]: active,
        })}
      >
        <Table className={detailsTable} includeRowTitles rows={getRows()} />
      </div>
    </>
  );
}

OrbitalDetails.propTypes = {
  data: PropTypes.object,
  velocity: PropTypes.number,
  type: PropTypes.string,
};

export default OrbitalDetails;
