import React from 'react';
import PropTypes from 'prop-types';
import QAExpansionList from './questions/qaExpansionList/index.jsx';
import QATextInput from './questions/qaTextInput';
import QASelect from './questions/qaSelect';
import Prompt from './questions/Prompt';

class QA extends React.PureComponent {
  renderQA() {
    const {
      questionType,
      question,
      answer,
      answerHandler,
      editHandler,
      saveHandler,
      activeId,
    } = this.props;

    if (questionType === 'accordion') {
      return (
        <QAExpansionList
          activeId={activeId}
          question={question}
          answer={answer}
          cancelHandler={answerHandler}
          saveHandler={saveHandler}
          editHandler={editHandler}
        />
      );
    }

    if (questionType === 'text' || questionType === 'textArea') {
      return (
        <QATextInput
          activeId={activeId}
          question={question}
          answer={answer}
          answerHandler={answerHandler}
        />
      );
    }

    if (questionType === 'select' || questionType === 'inline-select') {
      return (
        <QASelect
          activeId={activeId}
          question={question}
          answer={answer}
          handleAnswerSelect={answerHandler}
        />
      );
    }

    if (questionType === 'prompt') {
      return <Prompt question={question} />;
    }

    return <div>Question Placeholder</div>;
  }

  render() {
    return <div className="qa">{this.renderQA()}</div>;
  }
}

QA.propTypes = {
  questionType: PropTypes.string,
  question: PropTypes.object,
  answer: PropTypes.object,
  activeId: PropTypes.string,
  answerHandler: PropTypes.func,
  saveHandler: PropTypes.func,
  editHandler: PropTypes.func,
};

export default QA;
