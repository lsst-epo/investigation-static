import React from 'react';
import PropTypes from 'prop-types';
import { Trans, withTranslation } from 'gatsby-plugin-react-i18next';
import Table from '../../../site/forms/table/index.jsx';
import ObservationsTableCell from './ObservationsTableCell';
import { tableTitle } from './observations-tables.module.scss';

class ObservationsTable extends React.PureComponent {
  getCell(answers, cell) {
    const { accessor, id, data, content, type } = cell;

    if (content) {
      return (
        <span className="cell-body">
          <Trans>{content}</Trans>
        </span>
      );
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

    return <Trans>{cell}</Trans>;
  }

  createEmptyRows(length) {
    const rows = [];

    for (let i = 0; i < length; i += 1) {
      rows.push([]);
    }

    return rows;
  }

  getColTitles = colTitles => {
    const { t } = this.props;

    return colTitles.map(t);
  };

  getRows(answers, rowTitles, cells) {
    const rows = rowTitles
      ? rowTitles.map(this.translateCells)
      : this.createEmptyRows(cells.length);
    for (let j = 0; j < rows.length; j += 1) {
      cells[j].forEach(cell => {
        rows[j].push(this.getCell(answers, cell));
      });
    }
    return rows;
  }

  translateCells = cells => {
    const { t } = this.props;

    return cells ? cells.map(t) : cells;
  };

  render() {
    const { title, answers, rows, colTitles, rowTitles, fixed } = this.props;

    return (
      <>
        {title && (
          <h2 className={`${tableTitle} space-bottom`}>
            <Trans>{title}</Trans>
          </h2>
        )}
        <Table
          className="observations-table"
          colTitles={this.translateCells(colTitles)}
          includeRowTitles={!!rowTitles}
          rows={this.getRows(answers, rowTitles, rows)}
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
  t: PropTypes.func,
};

export default withTranslation()(ObservationsTable);
