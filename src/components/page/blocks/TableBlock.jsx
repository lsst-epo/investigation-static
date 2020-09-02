import React from 'react';
import PropTypes from 'prop-types';
import ObservationsTable from '../../charts/shared/observationsTables/ObservationsTable';

import {
  gridTable,
  gridTableTop,
  gridTableBottom,
  gridTableMiddle,
} from '../page.module.scss';

class TableBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.gridClasses = {
      top: gridTableTop,
      bottom: gridTableBottom,
      middle: gridTableMiddle,
    };
  }

  render() {
    const {
      block: table,
      blockShared: { answers },
      row,
    } = this.props;

    return (
      <div className={`${gridTable} ${this.gridClasses[row]}`}>
        <ObservationsTable {...table} answers={answers} />
      </div>
    );
  }
}

TableBlock.propTypes = {
  block: PropTypes.object,
  blockShared: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  row: PropTypes.string,
};

export default TableBlock;
