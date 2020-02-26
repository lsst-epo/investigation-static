import React from 'react';
import PropTypes from 'prop-types';
import ObservationsTable from './ObservationsTable';

class ObservationsTables extends React.PureComponent {
  filterTables({ row, col }) {
    const { tables } = this.props;
    if (!tables) return null;

    return tables.filter(table => {
      const { layout } = table;
      const { col: tableCol, row: tableRow } = layout || {};
      const COLUMN = col || 'left';
      const ROW = row || 'bottom';

      if (COLUMN === (tableCol || 'right') && ROW === (tableRow || 'bottom')) {
        table.position = [COLUMN, ROW].join('-');
        return table;
      }

      return null;
    });
  }

  render() {
    const { row: uRow, col: uCol, answers } = this.props;
    const col = uCol || 'left';
    const row = uRow || 'bottom';
    const Tables = this.filterTables({ row, col });

    return (
      <>
        {Tables &&
          Tables.map(table => {
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
  styles: PropTypes.object,
  tables: PropTypes.array,
  answers: PropTypes.object,
};
