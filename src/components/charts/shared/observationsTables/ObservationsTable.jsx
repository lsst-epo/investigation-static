import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { dashSepToCamelCase } from '../../../../lib/utilities.js';
import Table from '../../../site/forms/table/index.jsx';
import ObservationsTableCell from './ObservationsTableCell';
import styles from './observations-tables.module.scss';

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

  getPositionClassname(layout) {
    return `${styles.gridTable} ${
      styles[dashSepToCamelCase(`grid-table-${layout.col}-${layout.row}`)]
    }`;
  }

  render() {
    const { title, answers, rows, colTitles, rowTitles, layout } = this.props;

    return (
      <div className={this.getPositionClassname(layout)}>
        {title && <h1 className={styles.tableTitle}>{title}</h1>}
        <Table
          className="observations-table"
          colTitles={colTitles}
          includeRowTitles
          rows={this.getRows(answers, colTitles, rowTitles, rows)}
        />
      </div>
    );
  }
}

ObservationsTable.propTypes = {
  title: PropTypes.string,
  answers: PropTypes.object,
  rows: PropTypes.array,
  colTitles: PropTypes.array,
  rowTitles: PropTypes.array,
  layout: PropTypes.object,
};

export default ObservationsTable;
