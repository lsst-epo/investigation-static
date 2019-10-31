import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import { getMean } from '../../../lib/utilities';
import StellarValue from './StellarValue';
import StellarValueRange from './StellarValueRange';

class ObservationsTableCell extends React.PureComponent {
  rangifier(answerRange) {
    if (answerRange.length > 2) return false;
    if (!answerRange[0] || !answerRange[1]) return false;
    if (!answerRange[0].data || !answerRange[1].data) return false;
    if (answerRange[0].data[0] || answerRange[1].data[0]) {
      return [answerRange[0].data[0], answerRange[1].data[0]];
    }

    return false;
  }

  getCellValue(answer, answerRange, accessor) {
    if (answer && !answerRange) {
      let value = answer.data;

      if (accessor === 'count') {
        value = answer.content;
      } else if (isArray(value)) {
        value = getMean(value, accessor);
      } else if (isPlainObject(value)) {
        value = value[accessor];
      }

      return <StellarValue value={value} type={accessor} />;
    }

    if (!answer && answerRange) {
      const range = this.rangifier(answerRange);

      return range ? <StellarValueRange data={range} type={accessor} /> : '';
    }

    return '';
  }

  render() {
    const { answer, answerRange, accessor } = this.props;
    return this.getCellValue(answer, answerRange, accessor);
  }
}

ObservationsTableCell.propTypes = {
  answer: PropTypes.object,
  answerRange: PropTypes.array,
  accessor: PropTypes.string,
};

export default ObservationsTableCell;
