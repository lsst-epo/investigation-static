/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import QAExpansionList from './questions/qaExpansionList/index.jsx';
import QATextInput from './questions/qaTextInput';
import QASelect from './questions/qaSelect';
import QACompound from './questions/qaCompound';
import DistanceCalculator from './questions/qaCalculators/distanceCalculator';
import SizeCalculator from './questions/qaCalculators/sizeCalculator';
import Prompt from './questions/Prompt';
import QAMultiSelect from './questions/qaMultiSelect/index.jsx';
import { qa } from './styles.module.scss';

const questions = {
  accordion: QAExpansionList,
  text: QATextInput,
  textArea: QATextInput,
  select: QASelect,
  compound: QACompound,
  compoundSelect: QASelect,
  'inline-select': QASelect,
  multiSelect: QAMultiSelect,
  DistanceCalculator,
  SizeCalculator,
  prompt: Prompt,
};

class QA extends React.PureComponent {
  renderQA() {
    const { questionType, answerHandler } = this.props;

    if (questionType) {
      const QuestionComponent = questions[questionType];
      return QuestionComponent ? (
        <QuestionComponent {...this.props} handleAnswerSelect={answerHandler} />
      ) : (
        <div>
          Question Placeholder: {questionType} Question Type does not Exist
        </div>
      );
    }

    return <div>Question Placeholder</div>;
  }

  render() {
    const { questionType } = this.props;
    return (
      <div className={`${qa} qa-${questionType.toLowerCase()}`}>
        {this.renderQA()}
      </div>
    );
  }
}

QA.propTypes = {
  questionType: PropTypes.string,
  answerHandler: PropTypes.func,
};

export default QA;
