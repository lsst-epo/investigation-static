/* eslint-disable react/no-danger */
import React from 'react';
import { CardText } from 'react-md';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import QACalculatorLabel from '../qaCalculatorLabel';
import FindImpactCrater from './FindImpactCrater';
import QACalculatorInput from '../qaCalculatorInput';
import { QACalculatorIcon, QACalculatorIconUnit } from '../qaCalculatorIcons';
import { calculateCraterDiameter } from '../qaCalculatorUtilities';
import {
  calcLabel,
  answerable as answerableStyle,
  col50,
  marginTop,
} from '../qaCalculator.module.scss';

class ImpactCalculator extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: {
        craterDiameter: null,
        density: null,
        velocity: null,
        asteroidDiameter: null,
      },
      cardActive: false,
      hasFocus: false,
      answerable: false,
    };
  }

  componentDidMount() {
    const { answerable } = this.state;
    const { question, activeId, answer } = this.props;
    const { id } = question;
    const { data } = answer || {};
    const { craterDiameter, density, velocity, asteroidDiameter } = data || {};

    this.checkAnswerable(answerable, activeId === id);

    this.setState(prevState => ({
      ...prevState,
      value: {
        craterDiameter,
        density,
        velocity,
        asteroidDiameter,
      },
    }));
  }

  componentDidUpdate() {
    const { answerable } = this.state;
    const { question, activeId } = this.props;
    const { id } = question;

    this.checkAnswerable(answerable, activeId === id);
  }

  checkAnswerable(answerable, active) {
    if (!answerable && active) {
      this.setState(prevState => ({
        ...prevState,
        answerable: true,
      }));
    }
  }

  getNewVal(value, valType) {
    const { value: oldValue } = this.state;

    if (!value || !valType) return oldValue;

    const newVal = {
      ...oldValue,
      [valType]: value,
    };

    return {
      ...newVal,
      craterDiameter: calculateCraterDiameter(newVal),
    };
  }

  updateFocus(focusStatus) {
    const { question, focusCallback, answerHandler } = this.props;
    const { id } = question;
    const { value } = this.state;

    answerHandler(id, value || ' ', focusStatus ? 'focus' : 'blur');

    this.setState(
      prevState => ({
        ...prevState,
        hasFocus: focusStatus,
      }),
      () => {
        if (focusCallback) {
          const { hasFocus } = this.state;
          focusCallback(hasFocus);
        }
      }
    );
  }

  handleBlur = () => {
    this.updateFocus(false);
  };

  handleFocus = () => {
    this.updateFocus(true);
  };

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
    const {
      answerable,
      value: { density, velocity, asteroidDiameter, craterDiameter },
    } = this.state;

    const { id, label } = question;
    const active = activeId === id;
    const answered = !isEmpty(answer);
    const answeredClasses = {
      answered,
      unanswered: !answered,
      [answerableStyle]: answerable || answered || active,
    };
    const fieldClasses = classnames('qa-text-input', answeredClasses);
    const labelClasses = classnames(calcLabel, answeredClasses);

    return (
      <CardText>
        <QACalculatorLabel {...{ label, labelClasses }} />
        <div className="container">
          <QACalculatorInput
            containerWidth={col50}
            id={`number-input-${id}`}
            className={fieldClasses}
            leftIcon={<QACalculatorIcon content="D =" />}
            rightIcon={<QACalculatorIconUnit unit="m" />}
            placeholder="asteroid diameter"
            defaultValue={answered ? asteroidDiameter : null}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={debounce(
              value => this.handleChange(value, 'asteroidDiameter'),
              400
            )}
            disabled={!(answerable || answered || active)}
          />
          <QACalculatorInput
            containerWidth={col50}
            id={`number-input-${id}`}
            className={fieldClasses}
            leftIcon={<QACalculatorIcon content="p =" />}
            rightIcon={<QACalculatorIconUnit unit="kg/m<sup>3</sup>" />}
            placeholder="density"
            defaultValue={answered ? density : null}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={debounce(
              value => this.handleChange(value, 'density'),
              400
            )}
            disabled={!(answerable || answered || active)}
          />
          <QACalculatorInput
            containerWidth={col50}
            id={`number-input-${id}`}
            className={fieldClasses}
            leftIcon={<QACalculatorIcon content="v =" />}
            rightIcon={<QACalculatorIconUnit unit="m/s" />}
            placeholder="velocity"
            defaultValue={answered ? velocity : null}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={debounce(
              value => this.handleChange(value, 'velocity'),
              400
            )}
            disabled={!(answerable || answered || active)}
          />
        </div>
        <div className={marginTop}>
          <FindImpactCrater
            {...{ asteroidDiameter, density, velocity, craterDiameter }}
          />
        </div>
      </CardText>
    );
  }
}

ImpactCalculator.propTypes = {
  activeId: PropTypes.string,
  question: PropTypes.object,
  answerHandler: PropTypes.func,
  focusCallback: PropTypes.func,
  answer: PropTypes.object,
};

export default ImpactCalculator;
