import React from 'react';
import PropTypes from 'prop-types';
// import Card from '../../site/card/index.js';
import Unit from '../../charts/shared/unit/index.jsx';
import Table from '../../site/forms/table/index.jsx';
import { AU_PER_VIZ_UNIT } from './orbitalUtilities.js';
import { getValue } from '../../../lib/utilities.js';
// import { container } from './orbital-viewer.module.scss';

function OrbitalDetails(props) {
  const { data, velocity } = props;
  const { H, a, i, e, Principal_desig: ps } = data || {};

  return (
    <div>
      <Table
        className="details-table"
        colTitles={[
          'Name',
          'Semi-major Axis',
          'Eccentricity',
          'Inclination',
          'Absolute Magnitude',
          'Current Velocity',
        ]}
        includeRowTitles
        rows={[
          [
            ps || '',
            e ? getValue('eccentricity', e) : '',
            i ? (
              <>
                {getValue('inclination', i)}
                <Unit type="inclination" />
              </>
            ) : (
              ''
            ),
            a ? (
              <>
                {getValue('semimajor_axis', a)}
                <Unit type="semimajor_axis" />
              </>
            ) : (
              ''
            ),
            H ? getValue('magnitude', H) : '',
            velocity ? `${velocity} AU` : '',
          ],
        ]}
      />
    </div>
  );
}

OrbitalDetails.propTypes = {
  data: PropTypes.object,
  velocity: PropTypes.number,
};

export default OrbitalDetails;
