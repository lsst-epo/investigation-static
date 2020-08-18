/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import Question from 'react-md/lib/ExpansionPanels/ExpansionPanel';
import Answer from '../../answers/ExpansionPanel';
import { renderDef } from '../../../../lib/utilities.js';
import styles from './styles.module.scss';

class QAExpansionPanel extends React.PureComponent {
  render() {
    const {
      question,
      answer,
      active,
      columnWidths,
      focused,
      toggleHandler,
      cancelHandler,
      saveHandler,
      editHandler,
    } = this.props;
    const {
      answerPre,
      answerPost,
      answerAccessor,
      id: qId,
      qaReview,
      label,
    } = question;

    const answered = !isEmpty(answer);
    const isExpanded = active || answered;
    const showFooter = !answered || (!active && answered) ? null : undefined;

    const questionClasses = classnames(`${styles.qa} qa-${qId} no-pointer`, {
      [styles.active]: active,
      [styles.answered]: answered,
      unstyled: !active,
    });

    return (
      <Question
        columnWidths={columnWidths}
        focused={focused}
        label={<div dangerouslySetInnerHTML={renderDef(label)} />}
        className={questionClasses}
        contentClassName={styles.answer}
        expanded={isExpanded}
        onExpandToggle={() => toggleHandler(qId)}
        cancelLabel="Clear"
        onCancel={() => cancelHandler(qId)}
        onSave={() => saveHandler(qId)}
        closeOnCancel={false}
        saveSecondary
        footer={showFooter}
        disabled={qaReview}
      >
        {answered && (
          <Answer
            id={answer.id}
            pre={answerPre}
            post={answerPost}
            content={answer.content ? answer.content : answer.data}
            accessor={answerAccessor}
            showEditButton={!active && answered}
            editHandler={editHandler}
          />
        )}
      </Question>
    );
  }
}

QAExpansionPanel.propTypes = {
  answer: PropTypes.object,
  question: PropTypes.object,
  active: PropTypes.bool,
  columnWidths: PropTypes.array,
  focused: PropTypes.bool,
  toggleHandler: PropTypes.func,
  cancelHandler: PropTypes.func,
  saveHandler: PropTypes.func,
  editHandler: PropTypes.func,
};

export default QAExpansionPanel;
