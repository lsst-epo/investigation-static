import React, { useState } from 'react';
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

function OrbitalDetails({ data, velocity }) {
  const { H, a, i, e, Principal_desig: name } = data || {};
  const [active, setActive] = useState(false);

  function renderValueWithUnits(value, unitType, showUnit) {
    if (!value) return '';
    return (
      <>
        {getValue(unitType, value)}
        {showUnit && <Unit type={unitType} />}
      </>
    );
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
        <Table
          className={detailsTable}
          includeRowTitles
          rows={[
            ['Scientific Name', name || ''],
            [
              'Semi-major Axis',
              renderValueWithUnits(a, 'semimajor_axis', true),
            ],
            ['Eccentricity', renderValueWithUnits(e, 'eccentricity', false)],
            ['Inclination', renderValueWithUnits(i, 'inclination', true)],
            ['Absolute Magnitude', renderValueWithUnits(H, 'magnitude', false)],
            [
              'Speed',
              renderValueWithUnits(toSigFigs(velocity, 3), 'velocity', true),
            ],
          ]}
        />
      </div>
    </>
  );
}

OrbitalDetails.propTypes = {
  data: PropTypes.object,
  velocity: PropTypes.number,
};

export default OrbitalDetails;
