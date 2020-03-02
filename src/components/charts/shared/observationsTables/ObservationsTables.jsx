import React from 'react';
import PropTypes from 'prop-types';
import ObservationsTable from './ObservationsTable';

class ObservationsTables extends React.PureComponent {
  defaultLayout = {
    col: 'right',
    row: 'bottom',
  };

  filterTables({ row, col }, tables) {
    return tables.filter(table => {
      const { col: dCol, row: dRow } = this.defaultLayout;
      const { layout } = table || this.defaultLayout;
      const { col: tableCol, row: tableRow } = layout || {};
      const COLUMN = col || dCol;
      const ROW = row || dRow;

      if (COLUMN === (tableCol || dCol) && ROW === (tableRow || dRow)) {
        table.layout = {
          col: COLUMN,
          row: ROW,
        };
        return table;
      }

      return null;
    });
  }

  render() {
    const { tables, row, col, answers } = this.props;
    const Tables = tables ? this.filterTables({ row, col }, tables) : [];

    return (
      <>
        {Tables.map(table => {
          return (
            <ObservationsTable key={table.id} answers={answers} {...table} />
          );
        })}
      </>
    );
  }
}

export default ObservationsTables;

ObservationsTables.propTypes = {
  row: PropTypes.string,
  col: PropTypes.string,
  tables: PropTypes.array,
  answers: PropTypes.object,
};
