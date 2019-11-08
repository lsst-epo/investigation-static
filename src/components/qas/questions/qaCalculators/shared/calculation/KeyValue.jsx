import React from 'react';
import PropTypes from 'prop-types';
import { addTheCommas } from '../../../../../../lib/utilities';

export default function KeyValue(props) {
  const { name, value, commas } = props;
  return (
    <p>
      <span>{name}</span> = <span>{commas ? addTheCommas(+value) : value}</span>
    </p>
  );
}

KeyValue.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string || PropTypes.number,
  commas: PropTypes.bool,
};
