/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import QAExpansionList from './questions/qaExpansionList/index.jsx';
import QATextInput from './questions/qaTextInput/index.jsx';
import QASelect from './questions/qaSelect/index.jsx';
import QACompound from './questions/qaCompound/index.jsx';
import DistanceCalculator from './questions/qaCalculators/distanceCalculator/index.jsx';
import SizeCalculator from './questions/qaCalculators/sizeCalculator/index.jsx';
import KineticEnergyCalculator from './questions/qaCalculators/kineticEnergyCalculator/index.jsx';
import VolumeCalculator from './questions/qaCalculators/volumeCalculator/index.jsx';
import MassCalculator from './questions/qaCalculators/massCalculator/index.jsx';
import Prompt from './questions/Prompt.jsx';
import QAMultiSelect from './questions/qaMultiSelect/index.jsx';
import { qa } from './styles.module.scss';

const questions = {
  accordion: QAExpansionList,
  text: QATextInput,
  textArea: QATextInput,
  select: QASelect,
  'inline-select': QASelect,
  multiSelect: QAMultiSelect,
  compoundSelect: QACompound,
  compoundInput: QACompound,
  DistanceCalculator,
  SizeCalculator,
  KineticEnergyCalculator,
  VolumeCalculator,
  MassCalculator,
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
