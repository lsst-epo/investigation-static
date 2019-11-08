/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import QAExpansionList from './questions/qaExpansionList/index.jsx';
import QATextInput from './questions/qaTextInput';
import QASelect from './questions/qaSelect';
import DistanceCalculator from './questions/qaCalculators/distanceCalculator';
import Prompt from './questions/Prompt';

const questions = {
  accordion: QAExpansionList,
  text: QATextInput,
  textArea: QATextInput,
  select: QASelect,
  compoundSelect: QASelect,
  'inline-select': QASelect,
  DistanceCalculator,
  prompt: Prompt,
};

class QA extends React.PureComponent {
  renderQA() {
    const { questionType, answerHandler } = this.props;

    if (questionType) {
      const QuestionComponent = questions[questionType];
      return (
        <QuestionComponent {...this.props} handleAnswerSelect={answerHandler} />
      );
    }

    return <div>Question Placeholder</div>;
  }

  render() {
    return <div className="qa">{this.renderQA()}</div>;
  }
}

QA.propTypes = {
  questionType: PropTypes.string,
  answerHandler: PropTypes.func,
};

export default QA;
