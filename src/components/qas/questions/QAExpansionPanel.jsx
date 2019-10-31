/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import Question from 'react-md/lib//ExpansionPanels/ExpansionPanel';
import Answer from '../answers/ExpansionPanel';
import { renderDef } from '../../../lib/utilities.js';

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
    const { answerPre, answerAccessor, id: qId, label } = question;

    const answered = !isEmpty(answer);
    const isExpanded = active || answered;
    const showFooter = !answered || (!active && answered) ? null : undefined;

    const questionClasses = classnames(`qa qa-${qId} no-pointer`, {
      active,
      answered,
      unstyled: !active,
    });

    return (
      <Question
        columnWidths={columnWidths}
        focused={focused}
        label={<div dangerouslySetInnerHTML={renderDef(label)} />}
        className={questionClasses}
        contentClassName="answer"
        expanded={isExpanded}
        onExpandToggle={() => toggleHandler(qId)}
        cancelLabel="Clear"
        onCancel={() => cancelHandler(qId)}
        onSave={() => saveHandler(qId)}
        closeOnCancel={false}
        saveSecondary
        footer={showFooter}
      >
        {answered && (
          <Answer
            id={answer.id}
            pre={answerPre}
            content={answer.content}
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
