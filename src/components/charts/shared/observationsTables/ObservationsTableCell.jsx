import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import { getMean } from '../../../../lib/utilities';
import StellarValue from '../StellarValue';
import StellarValueRange from '../StellarValueRange';

class ObservationsTableCell extends React.PureComponent {
  getCellValue(answer, accessor, type) {
    if (answer) {
      let value = answer.data;

      if (value && accessor === 'data') {
        return <span>{value}</span>;
      }

      if (accessor === 'range') {
        return <StellarValueRange type={type} data={answer.data} />;
      }

      if (accessor === 'count') {
        value = answer.content;
      } else if (isArray(value)) {
        value = getMean(value, accessor);
      } else if (isPlainObject(value)) {
        value = value[accessor];
      }

      return <StellarValue value={value} type={accessor} />;
    }

    return '';
  }

  render() {
    const { answer, accessor, type } = this.props;
    return this.getCellValue(answer, accessor, type);
  }
}

ObservationsTableCell.propTypes = {
  answer: PropTypes.object,
  accessor: PropTypes.string,
  type: PropTypes.string,
};

export default ObservationsTableCell;
