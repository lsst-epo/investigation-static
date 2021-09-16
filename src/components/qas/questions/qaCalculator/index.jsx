import React from 'react';
import { CardText, CardActions } from 'react-md';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import Card from '../../../site/card';
import TextField from '../../../site/forms/textField';
import {
  DistanceCalculator,
  ImpactCalculator,
  ImpactDamageCalculator,
  KineticEnergyCalculator,
  SizeCalculator,
  MassCalculator,
} from './qaCalculatorsData.jsx';
import CalculatedMeasurement from './CalculatedMeasurement';
import FindDistanceModulus from './equations/FindDistanceModulus';
import FindParsecs from './equations/FindParsecs';
import { renderDef } from '../../../../lib/utilities';
import {
  active as activeClass,
  qaCard,
  qaReviewBlock,
  answerContent,
  qaReviewNoActiveState,
  calculatorLabel,
} from '../../styles.module.scss';
import {
  qaCalc,
  calcLabel,
  answerable as answerableStyle,
  marginTop,
  textFieldContainer,
  qaCalcInput,
} from './qaCalculator.module.scss';

class QACalculator extends React.PureComponent {
  constructor(props) {
    super(props);

    this.calculator = {
      DistanceCalculator,
      KineticEnergyCalculator,
      SizeCalculator,
      ImpactCalculator,
      MassCalculator,
      ImpactDamageCalculator,
    };

    this.state = {
      value: {},
      formula: null,
      hasFocus: false,
      answerable: false,
    };
  }

  componentDidMount() {
    const { answerable } = this.state;
    const { question, activeId, answer, prepopulateAnswer } = this.props;
    const { id } = question;
    const { data } = answer || {};
    const { data: prepopulateData } = prepopulateAnswer || {};

    this.checkAnswerable(answerable, activeId === id);

    this.setState(prevState => ({
      ...prevState,
      value: this.getAnswersFromData({ ...prepopulateData, ...data }),
    }));
  }

  componentDidUpdate() {
    const { answerable } = this.state;
    const { question, activeId } = this.props;
    const { id } = question;

    this.checkAnswerable(answerable, activeId === id);
  }

  getAnswersFromData(data) {
    const { question } = this.props;
    const { questionType } = question || {};
    const { value } = this.calculator[questionType];
    return {
      ...value,
      ...data,
    };
  }

  checkAnswerable(answerable, active) {
    if (!answerable && active) {
      this.setState(prevState => ({
        ...prevState,
        answerable: true,
      }));
    }
  }

  updateFocus(focusStatus) {
    const { question, answerHandler } = this.props;
    const { id } = question;
    const { value } = this.state;

    answerHandler(id, value || ' ', focusStatus ? 'focus' : 'blur');

    this.setState(prevState => ({
      ...prevState,
      hasFocus: focusStatus,
    }));
  }

  handleBlur = () => {
    this.updateFocus(false);
  };

  handleFocus = () => {
    this.updateFocus(true);
  };

  getNewVal(value, valType) {
    const { question } = this.props;
    const { questionType } = question || {};
    const { value: oldValue } = this.state;
    const { solutionVariable, formula } = this.calculator[questionType];

    if (!solutionVariable) return formula(value);

    const newVal = {
      ...oldValue,
      [valType]: value,
    };

    if (solutionVariable === 'all') {
      return {
        ...newVal,
        ...formula(newVal),
      };
    }

    return {
      ...newVal,
      [solutionVariable]: formula(newVal),
    };
  }

  handleMinMax = (input, value) => {
    const { min = 0, max = Infinity } = input;
    if (+value < +min) return +min;
    if (+value > +max) return +max;

    return value;
  };

  handleChange = (value, valType, input) => {
    const { question, answerHandler } = this.props;
    const { id } = question;
    const preppedValue = this.handleMinMax(input, value);

    this.setState(
      prevState => ({
        ...prevState,
        hasFocus: true,
        value: {
          ...this.getNewVal(preppedValue, valType),
        },
      }),
      () => {
        const { value: updatedVal } = this.state;
        answerHandler(id, updatedVal, 'change');
      }
    );
  };

  render() {
    const { questionNumber, question, answer, activeId } = this.props;
    const { answerable, value, hasFocus } = this.state;

    const { questionType, qaReview } = question;

    const { id, label } = question;
    const active = activeId === id;
    const answered = !isEmpty(answer);
    const answeredClasses = {
      answered,
      unanswered: !answered,
      [answerableStyle]: answerable || answered || active,
      answerable: answerable || answered || active,
    };
    const cardClasses = classnames(qaCard, qaCalc, marginTop, {
      [activeClass]: hasFocus,
      [qaReviewNoActiveState]: qaReview,
    });
    const fieldClasses = classnames(
      'qa-text-input',
      qaCalcInput,
      answeredClasses
    );
    const labelClasses = classnames(
      calcLabel,
      answeredClasses,
      calculatorLabel
    );

    const { inputs, equation } = this.calculator[questionType];
    const FindEquation = equation || null;

    const updatedLabel = questionNumber ? `${questionNumber}. ${label}` : label;

    return (
      <Card
        className={cardClasses}
        data-testid="qa-calc-card"
        expanded={hasFocus}
        onExpanderClick={() => {}}
      >
        <CardText>
          <div
            className={labelClasses}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={renderDef(updatedLabel)}
          />
          <div className="container">
            {inputs &&
              inputs.map((input, i) => {
                const {
                  containerWidth,
                  leftIcon,
                  rightIcon,
                  label: inputLabel,
                  placeholder,
                  defaultValue,
                  max,
                  min,
                } = input;
                const textFieldContainerClasses = classnames(
                  textFieldContainer,
                  {
                    [containerWidth]: containerWidth,
                  }
                );
                return (
                  <div
                    className={textFieldContainerClasses}
                    key={`text-input-${id}-${defaultValue}`}
                  >
                    {qaReview && (
                      <p className={`equation ${qaReviewBlock}`}>
                        <span>{inputLabel}</span>
                        <span>{leftIcon}&nbsp;</span>
                        <span className={answerContent}>
                          {value[defaultValue] || '(No answer provided)'}
                        </span>
                        {value[defaultValue] && <span>{rightIcon}</span>}
                      </p>
                    )}
                    {!qaReview && (
                      <TextField
                        id={`text-input-${id}-${defaultValue}`}
                        data-testid={`qa-calc-input-${i}`}
                        className={classnames(fieldClasses, {
                          'no-label': !inputLabel,
                        })}
                        leftIcon={leftIcon}
                        rightIcon={rightIcon}
                        label={inputLabel}
                        placeholder={placeholder}
                        lineDirection="center"
                        type="number"
                        min={min}
                        max={max}
                        value={value[defaultValue] || ''}
                        onBlur={this.handleBlur}
                        onFocus={this.handleFocus}
                        onChange={onChangeValue =>
                          this.handleChange(onChangeValue, defaultValue, input)
                        }
                        disabled={!(answerable || answered || active)}
                      />
                    )}
                  </div>
                );
              })}
          </div>
          {questionType !== 'DistanceCalculator' && (
            <div className={marginTop}>
              <FindEquation {...value} {...{ qaReview }} />
            </div>
          )}
        </CardText>
        {questionType === 'DistanceCalculator' && (
          <>
            <CardActions expander style={{ display: 'none' }} />
            <CardText expandable>
              <FindDistanceModulus
                variable={value.magnitude}
                {...{ qaReview }}
              />
              <FindParsecs variable={value.distanceModulus} {...{ qaReview }} />
              <div className="results-list">
                <CalculatedMeasurement
                  unit="Mly"
                  value={value.megaLightYears}
                />
              </div>
            </CardText>
          </>
        )}
      </Card>
    );
  }
}

QACalculator.propTypes = {
  activeId: PropTypes.string,
  question: PropTypes.object.isRequired,
  questionNumber: PropTypes.number,
  answerHandler: PropTypes.func,
  answer: PropTypes.object,
  prepopulateAnswer: PropTypes.object,
};

export default QACalculator;
