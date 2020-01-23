import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import Table from '../../site/forms/table/index.jsx';
import ObservationsTableCell from './ObservationsTableCell';

class ObservationsTable extends React.PureComponent {
  getCell(answers, cell) {
    const { accessor, id, ids, data } = cell;

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
      <div className="table-container">
        {title && (
          <h1
            style={{ fontSize: '1.5rem', lineHeight: '1', marginTop: '10px' }}
          >
            {title}
          </h1>
        )}
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
};

export default ObservationsTable;
