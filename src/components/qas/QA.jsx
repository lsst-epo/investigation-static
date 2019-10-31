import React from 'react';
import PropTypes from 'prop-types';
import QAExpansionList from './questions/QAExpansionList';
import QATextInput from './questions/QATextInput';
import QASelect from './questions/QASelect';
import Prompt from './questions/Prompt';

class QA extends React.PureComponent {
  renderQA() {
    const {
      type,
      question,
      answer,
      answerHandler,
      editHandler,
      saveHandler,
      activeId,
    } = this.props;

    if (type === 'accordion') {
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

    if (type === 'text' || type === 'textArea') {
      return (
        <QATextInput
          activeId={activeId}
          question={question}
          answer={answer}
          handleChange={answerHandler}
          handleBlur={answerHandler}
        />
      );
    }

    if (type === 'select' || type === 'inline-select') {
      return (
        <QASelect
          activeId={activeId}
          question={question}
          answer={answer}
          handleAnswerSelect={answerHandler}
        />
      );
    }

    // if (type === 'compound-select') {
    //   return (
    //     <QACompoundSelect
    //       activeId={activeId}
    //       question={question}
    //       answer={answer}
    //       handleAnswerSelect={answerHandler}
    //     />
    //   );
    // }

    if (type === 'prompt') {
      return <Prompt question={question} />;
    }

    return <div>Question Placeholder</div>;
  }

  render() {
    return <div className="qa">{this.renderQA()}</div>;
  }
}

QA.propTypes = {
  type: PropTypes.string,
  question: PropTypes.object,
  answer: PropTypes.object,
  activeId: PropTypes.string,
  answerHandler: PropTypes.func,
  saveHandler: PropTypes.func,
  editHandler: PropTypes.func,
};

export default QA;
