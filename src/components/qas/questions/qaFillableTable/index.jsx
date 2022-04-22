/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Card } from 'react-md';
import { withTranslation } from 'gatsby-plugin-react-i18next';
import { renderDef } from '../../../../lib/utilities.js';
import ConditionalWrapper from '../../../ConditionalWrapper';
import Table from '../../../site/forms/table';
import FillableTableTextInput from './FillableTableTextInput';
import FillableTableRangeInput from './FillableTableRangeInput';
import qaStyles from '../../styles.module.scss';

class QAFillableTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.qaTypes = {
      text: FillableTableTextInput,
      range: FillableTableRangeInput,
    };
  }

  createEmptyRows = length => {
    const rows = [];

    for (let i = 0; i < length; i += 1) {
      rows.push([]);
    }

    return rows;
  };

  getCell = (cell, questions, answers) => {
    const { id } = cell;
    const question = questions[id];

    if (question) {
      const { activeId, focusCallback, answerHandler } = this.props;
      const { questionType } = question;
      const TableCell = this.qaTypes[questionType];

      return (
        <TableCell
          answer={answers[id]}
          {...{
            activeId,
            question,
            focusCallback,
            answerHandler,
          }}
        />
      );
    }

    return null;
  };

  getRows = (cells, rowTitles, questions, answers) => {
    const rows = rowTitles
      ? rowTitles.map(this.translateCells)
      : this.createEmptyRows(cells.length);
    for (let j = 0; j < rows.length; j += 1) {
      cells[j].forEach(cell => {
        rows[j].push(this.getCell(cell, questions, answers));
      });
    }
    return rows;
  };

  translateCells = cells => {
    const { t } = this.props;

    return cells.map(t);
  };

  render() {
    const { questions, answers, table, questionNumber, t } = this.props;
    const { rows, colTitles, rowTitles, fixed, label } = table;
    const qaReview = questions.some(question => question.qaReview);

    const cardClasses = classnames(qaStyles.qaCard);
    const labelClasses = classnames(qaStyles.labelWithNumber, {
      [qaStyles.answerLabel]: qaReview,
    });
    const tableClasses = classnames('fillable-table', {
      [qaStyles.answerContent]: qaReview,
    });

    const updatedLabel =
      questionNumber && label ? `${questionNumber}. ${t(label)}` : t(label);

    const mappedQuestions = questions.reduce((result, question) => {
      const { id } = question;
      result[id] = question;
      return result;
    }, {});

    return (
      <ConditionalWrapper
        condition={qaReview}
        wrapper={children => (
          <span className={qaStyles.qaReviewBlock}>{children}</span>
        )}
      >
        <Card className={cardClasses}>
          <span
            className={labelClasses}
            dangerouslySetInnerHTML={renderDef(updatedLabel)}
          />
          <Table
            colTitles={this.translateCells(colTitles)}
            includeRowTitles={!!rowTitles}
            fixed={fixed}
            rows={this.getRows(rows, rowTitles, mappedQuestions, answers)}
            className={tableClasses}
          />
        </Card>
      </ConditionalWrapper>
    );
  }
}

QAFillableTable.propTypes = {
  activeId: PropTypes.string,
  questionNumber: PropTypes.number,
  questions: PropTypes.array,
  focusCallback: PropTypes.func,
  answerHandler: PropTypes.func,
  answers: PropTypes.object,
  table: PropTypes.object,
  t: PropTypes.func,
};

export default withTranslation()(QAFillableTable);
