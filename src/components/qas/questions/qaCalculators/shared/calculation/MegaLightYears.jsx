import React from 'react';
import PropTypes from 'prop-types';
import { addTheCommas } from '../../../../../../lib/utilities';

export default function MegaLightYears(props) {
  const { value } = props;
  return (
    <p>
      Mega Light Years (Mly) ={' '}
      {typeof value === 'string' ? value : addTheCommas(+value)}
    </p>
  );
}

MegaLightYears.propTypes = {
  value: PropTypes.string,
};
