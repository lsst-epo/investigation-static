import React from 'react';
import PropTypes from 'prop-types';
// import Card from '../../site/card/index.js';
import Unit from '../../charts/shared/unit/index.jsx';
import Table from '../../site/forms/table/index.jsx';
import { getValue } from '../../../lib/utilities.js';
// import { container } from './orbital-viewer.module.scss';

function OrbitalDetails(props) {
  const { data } = props;
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
          ],
        ]}
      />
    </div>
  );
}

OrbitalDetails.propTypes = {
  data: PropTypes.object,
};

export default OrbitalDetails;
