import React from 'react';
import PropTypes from 'prop-types';
import { addTheCommas } from '../../../../../../lib/utilities';

export default function MegaParsecs(props) {
  const { value } = props;
  return (
    <p>
      Mega Parsecs (Mpc) ={' '}
      {typeof value === 'string' ? value : addTheCommas(+value)}
    </p>
  );
}

MegaParsecs.propTypes = {
  value: PropTypes.string || PropTypes.number,
};
