import React from 'react';
import PropTypes from 'prop-types';
import StellarValue from '../../shared/StellarValue';
import { legendBox, detail, output } from './legend.module.scss';

class LegendBox extends React.PureComponent {
  isSelected(id, data) {
    let selected = false;
    if (!data) return selected;

    data.forEach(datum => {
      if (datum.id === id) {
        selected = true;
      }
    });

    return selected;
  }

  render() {
    const { id, selectedData, label, valueAccessor, value } = this.props;

    return (
      <div className={legendBox}>
        <div className={detail}>{label}</div>
        <div className={`${detail} ${output}`}>
          {this.isSelected(id, selectedData) ? (
            <StellarValue type={valueAccessor} value={value} />
          ) : (
            <span>&nbsp;</span>
          )}
        </div>
      </div>
    );
  }
}
export default LegendBox;

LegendBox.propTypes = {
  id: PropTypes.string,
  selectedData: PropTypes.array,
  label: PropTypes.string,
  valueAccessor: PropTypes.string,
  value: PropTypes.any,
};
