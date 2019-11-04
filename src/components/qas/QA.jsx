import React from 'react';
import PropTypes from 'prop-types';
import QAExpansionList from './questions/QAExpansionList';
import QATextInput from './questions/QATextInput';
import QASelect from './questions/qaSelect';
// import CompoundSelect from './questions/CompoundSelect';
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
          question={question[0]}
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
          question={question[0]}
          answer={answer}
          handleChange={answerHandler}
          handleBlur={answerHandler}
        />
      );
    }

    if (questionType === 'select' || questionType === 'inline-select') {
      return (
        <QASelect
          activeId={activeId}
          question={question[0]}
          answer={answer}
          handleAnswerSelect={answerHandler}
        />
      );
    }

    if (questionType === 'prompt') {
      return <Prompt question={question[0]} />;
    }

    // if (questionType === 'compoundSelect') {
    //   return (
    //     <CompoundSelect
    //       activeId={activeId}
    //       questions={question}
    //       answers={answer}
    //       handleAnswerSelect={answerHandler}
    //     />
    //   );
    // }

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
