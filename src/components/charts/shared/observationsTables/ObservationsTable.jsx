import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import Table from '../../../site/forms/table/index.jsx';
import ObservationsTableCell from './ObservationsTableCell';
import { tableTitle } from './observations-tables.module.scss';

class ObservationsTable extends React.PureComponent {
  getCell(answers, cell) {
    const { accessor, id, ids, data, content } = cell;

    if (content) {
      return <span className="cell-body">{content}</span>;
    }

    if (ids && accessor) {
      return (
        <ObservationsTableCell
          answerRange={[answers[ids[0]], answers[ids[1]]]}
          accessor={accessor}
        />
      );
    }

    if (id && accessor) {
      return <ObservationsTableCell answer={answers[id]} accessor={accessor} />;
    }

    if (data && accessor) {
      return <ObservationsTableCell answer={data} accessor={accessor} />;
    }

    return cell;
  }

  getRows(answers, colTitles, rowTitles, cells) {
    const rows = cloneDeep(rowTitles);
    for (let j = 0; j < rows.length; j += 1) {
      cells[j].forEach(cell => {
        rows[j].push(this.getCell(answers, cell));
      });
    }
    return rows;
  }

  render() {
    const { title, answers, rows, colTitles, rowTitles } = this.props;

    return (
      <>
        {title && <h1 className={tableTitle}>{title}</h1>}
        <Table
          className="observations-table"
          colTitles={colTitles}
          includeRowTitles
          rows={this.getRows(answers, colTitles, rowTitles, rows)}
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
};

export default ObservationsTable;
