import React from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-md/lib//DataTables/DataTable';
import TableHeader from 'react-md/lib//DataTables/TableHeader';
import TableBody from 'react-md/lib//DataTables/TableBody';
import TableRow from 'react-md/lib//DataTables/TableRow';
import TableColumn from 'react-md/lib//DataTables/TableColumn';

class Table extends React.PureComponent {
  render() {
    const { colTitles, includeRowTitles, rows, className } = this.props;

    return (
      <DataTable plain fullWidth className={className}>
        {colTitles && (
          <TableHeader>
            <TableRow>
              {colTitles.map(title => {
                return (
                  <TableColumn key={`col-title-${title}`}>{title}</TableColumn>
                );
              })}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {/* eslint-disable react/no-array-index-key */}
          {rows.map((row, i) => (
            <TableRow key={`row-${i}`}>
              {row.map((col, j) => {
                if (includeRowTitles && j === 0) {
                  return (
                    <TableColumn key={`col-${j}`} className="row-title">
                      {col}
                    </TableColumn>
                  );
                }

                return <TableColumn key={`col-${j}`}>{col}</TableColumn>;
              })}
            </TableRow>
          ))}
          {/* eslint-enable react/no-array-index-key */}
        </TableBody>
      </DataTable>
    );
  }
}

Table.propTypes = {
  className: PropTypes.string,
  colTitles: PropTypes.array,
  rows: PropTypes.array,
  includeRowTitles: PropTypes.bool,
};

export default Table;
