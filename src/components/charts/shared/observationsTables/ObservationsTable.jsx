import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import Table from '../../../site/forms/table/index.jsx';
import ObservationsTableCell from './ObservationsTableCell';
import { tableTitle } from './observations-tables.module.scss';

class ObservationsTable extends React.PureComponent {
  getCell(answers, cell) {
    const { accessor, id, data, content, type } = cell;

    if (content) {
      return <span className="cell-body">{content}</span>;
    }

    if (id && accessor) {
      return (
        <ObservationsTableCell
          answer={answers[id]}
          accessor={accessor}
          type={type}
        />
      );
    }

    if (data && accessor) {
      return (
        <ObservationsTableCell answer={data} accessor={accessor} type={type} />
      );
    }

    return cell;
  }

  createEmptyRows(length) {
    const rows = [];

    for (let i = 0; i < length; i += 1) {
      rows.push([]);
    }

    return rows;
  }

  getRows(answers, colTitles, rowTitles, cells) {
    const rows = rowTitles
      ? cloneDeep(rowTitles)
      : this.createEmptyRows(cells.length);
    for (let j = 0; j < rows.length; j += 1) {
      cells[j].forEach(cell => {
        rows[j].push(this.getCell(answers, cell));
      });
    }
    return rows;
  }

  render() {
    const { title, answers, rows, colTitles, rowTitles, fixed } = this.props;

    return (
      <>
        {title && <h2 className={`${tableTitle} space-bottom`}>{title}</h2>}
        <Table
          className="observations-table"
          colTitles={colTitles}
          includeRowTitles={!!rowTitles}
          rows={this.getRows(answers, colTitles, rowTitles, rows)}
          fixed={fixed}
        />
      </>
    );
  }
}

ObservationsTable.propTypes = {
  title: PropTypes.string,
  answers: PropTypes.object,
  rows: PropTypes.array,
  colTitles: PropTypes.array,
  rowTitles: PropTypes.array,
  fixed: PropTypes.bool,
};

export default ObservationsTable;
