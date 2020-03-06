import React from 'react';
import PropTypes from 'prop-types';
import ObservationsTable from './ObservationsTable';

class ObservationsTables extends React.PureComponent {
  filterTables({ getRow, getCol }, tables) {
    const { col, row } = this.props;
    return tables.filter(table => {
      const { layout } = table || {};
      const { col: tableCol, row: tableRow } = layout || {};

      if (getCol === (tableCol || col) && getRow === (tableRow || row)) {
        table.layout = { col: getCol, row: getRow };
        return table;
      }

      return null;
    });
  }

  render() {
    const { tables, getRow, getCol, answers } = this.props;

    return (
      <>
        {tables &&
          this.filterTables({ getRow, getCol }, tables).map(table => {
            return (
              <ObservationsTable key={table.id} answers={answers} {...table} />
            );
          })}
      </>
    );
  }
}

ObservationsTables.defaultProps = {
  col: 'left',
  row: 'bottom',
};

export default ObservationsTables;

ObservationsTables.propTypes = {
  getRow: PropTypes.string,
  getCol: PropTypes.string,
  row: PropTypes.string,
  col: PropTypes.string,
  tables: PropTypes.array,
  answers: PropTypes.object,
};
