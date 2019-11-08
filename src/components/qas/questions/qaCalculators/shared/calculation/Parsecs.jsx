import React from 'react';
import PropTypes from 'prop-types';
import { addTheCommas } from '../../../../../../lib/utilities';

export default function Parsecs(props) {
  const { value } = props;
  return (
    <p>
      Parsecs (pc) = {typeof value === 'string' ? value : addTheCommas(+value)}
    </p>
  );
}

Parsecs.propTypes = {
  value: PropTypes.string || PropTypes.number,
};
