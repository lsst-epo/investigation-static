import React from 'react';
import { CardText, CardActions } from 'react-md';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import Card from '../../../site/card';
import TextField from '../../../site/forms/textField';
import {
  DistanceCalculator,
  ImpactCalculator,
  KineticEnergyCalculator,
  SizeCalculator,
} from './qaCalculatorsData.jsx';
import CalculatedMeasurement from './CalculatedMeasurement';
import FindDistanceModulus from './equations/FindDistanceModulus';
import FindParsecs from './equations/FindParsecs';
import { active as activeClass, qaCard } from '../../styles.module.scss';
import {
  qaCalc,
  calcLabel,
  col50,
  answerable as answerableStyle,
  marginTop,
} from './qaCalculator.module.scss';

class QACalculator extends React.PureComponent {
  constructor(props) {
    super(props);

    this.calculator = {
      DistanceCalculator,
      KineticEnergyCalculator,
      SizeCalculator,
      ImpactCalculator,
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
    const { question, activeId, answer } = this.props;
    const { id } = question;
    const { data } = answer || {};

    this.checkAnswerable(answerable, activeId === id);

    this.setState(prevState => ({
      ...prevState,
      value: this.getAnswersFromData(data),
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

    if (!value || !valType) return oldValue;

    if (!solutionVariable) return formula(value);

    const newVal = {
      ...oldValue,
      [valType]: value,
    };

    return {
      ...newVal,
      [solutionVariable]: formula(newVal),
    };
  }

  handleChange = (value, valType) => {
    const { question, answerHandler } = this.props;
    const { id } = question;

    this.setState(
      prevState => ({
        ...prevState,
        hasFocus: true,
        value: {
          ...this.getNewVal(+value, valType),
        },
      }),
      () => {
        const { value: updatedVal } = this.state;
        answerHandler(id, updatedVal, 'change');
      }
    );
  };

  render() {
    const { question, answer, activeId } = this.props;
    const { answerable, value, hasFocus } = this.state;

    const { questionType } = question;

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
    });
    const fieldClasses = classnames('qa-text-input', answeredClasses);
    const labelClasses = classnames(calcLabel, answeredClasses);

    const { inputs, equation } = this.calculator[questionType];
    const FindEquation = equation || null;

    return (
      <Card
        className={cardClasses}
        data-testid="qa-calc-card"
        expanded={hasFocus}
        onExpanderClick={() => {}}
      >
        <CardText>
          <div className={labelClasses}>{label}</div>
          <div className="container">
            {inputs &&
              inputs.map((input, i) => {
                const {
                  containerWidth,
                  leftIcon,
                  rightIcon,
                  placeholder,
                  defaultValue,
                } = input;

                return (
                  <div
                    className={containerWidth || col50}
                    key={`text-input-${id}-${defaultValue}`}
                  >
                    <TextField
                      id={`text-input-${id}-${defaultValue}`}
                      data-testid={`qa-calc-input-${i}`}
                      className={fieldClasses}
                      leftIcon={leftIcon}
                      rightIcon={rightIcon}
                      placeholder={placeholder}
                      lineDirection="center"
                      type="number"
                      min="0"
                      defaultValue={answered ? value[defaultValue] : null}
                      onBlur={this.handleBlur}
                      onFocus={this.handleFocus}
                      onChange={debounce(
                        onChangeValue =>
                          this.handleChange(onChangeValue, defaultValue),
                        400
                      )}
                      disabled={!(answerable || answered || active)}
                    />
                  </div>
                );
              })}
          </div>
          {questionType !== 'DistanceCalculator' && (
            <div className={marginTop}>
              <FindEquation {...value} />
            </div>
          )}
        </CardText>
        {questionType === 'DistanceCalculator' && (
          <>
            <CardActions expander style={{ display: 'none' }} />
            <CardText expandable>
              <FindDistanceModulus variable={value.magnitude} />
              <FindParsecs variable={value.distanceModulus} />
              <div className="results-list">
                <CalculatedMeasurement unit="pc" value={value.parsecs} />
                <CalculatedMeasurement unit="Mpc" value={value.megaParsecs} />
                <CalculatedMeasurement unit="ly" value={value.lightYears} />
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
  answerHandler: PropTypes.func,
  answer: PropTypes.object,
};

export default QACalculator;
