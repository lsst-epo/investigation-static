import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DataTable from 'react-md/lib//DataTables/DataTable';
import TableHeader from 'react-md/lib//DataTables/TableHeader';
import TableBody from 'react-md/lib//DataTables/TableBody';
import TableRow from 'react-md/lib//DataTables/TableRow';
import TableColumn from 'react-md/lib//DataTables/TableColumn';
import styles from './table.module.scss';

class Table extends React.PureComponent {
  render() {
    const { colTitles, includeRowTitles, rows, className, fixed } = this.props;

    return (
      <div className={styles.tableWrapper}>
        <DataTable
          plain
          responsive
          fullWidth
          tabIndex="0"
          className={className}
          tableClassName={fixed ? styles.fixed : ''}
          data-testid="test-table"
        >
          {colTitles && (
            <TableHeader>
              <TableRow>
                {colTitles.map(title => {
                  return (
                    <TableColumn
                      plain
                      key={`col-title-${title}`}
                      style={{
                        width: fixed ? `${100 / colTitles.length})%` : 'auto',
                      }}
                    >
                      {title}
                    </TableColumn>
                  );
                })}
              </TableRow>
            </TableHeader>
          )}
          {rows && (
            <TableBody>
              {/* eslint-disable react/no-array-index-key */}
              {rows.map((row, i) => (
                <TableRow key={`row-${i}`}>
                  {row.map((col, j) => {
                    return (
                      <TableColumn
                        key={`col-${j}`}
                        plain
                        className={classnames({
                          'row-title': includeRowTitles && j === 0,
                        })}
                      >
                        {col}
                      </TableColumn>
                    );
                  })}
                </TableRow>
              ))}
              {/* eslint-enable react/no-array-index-key */}
            </TableBody>
          )}
        </DataTable>
      </div>
    );
  }
}

Table.propTypes = {
  className: PropTypes.string,
  colTitles: PropTypes.array,
  rows: PropTypes.array,
  includeRowTitles: PropTypes.bool,
  fixed: PropTypes.bool,
};

export default Table;
