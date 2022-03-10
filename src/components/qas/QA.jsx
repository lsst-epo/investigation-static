/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'gatsby-plugin-react-i18next';
import QAExpansionList from './questions/qaExpansionList/index.jsx';
import QATextInput from './questions/qaTextInput/index.jsx';
import QASelect from './questions/qaSelect/index.jsx';
import QACompound from './questions/qaCompound/index.jsx';
import QACalculator from './questions/qaCalculator/index.jsx';
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
  DistanceCalculator: QACalculator,
  SizeCalculator: QACalculator,
  MassCalculator: QACalculator,
  MassKECalculator: QACalculator,
  KineticEnergyCalculator: QACalculator,
  ImpactCalculator: QACalculator,
  ImpactDamageCalculator: QACalculator,
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
          <Trans values={questionType}>qas.question_placeholder</Trans>
        </div>
      );
    }

    return (
      <div>
        <Trans tOptions={{ context: 'no-type' }}>
          qas.question_placeholder
        </Trans>
      </div>
    );
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
