/* eslint-disable react/no-danger */
import React from 'react';
import { CardText } from 'react-md';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import FindDiameter from './FindDiameter';
import QACalculatorLabel from '../qaCalculatorLabel';
import QACalculatorInput from '../qaCalculatorInput';
import { QACalculatorIcon } from '../qaCalculatorIcons';
import { calculateDiameter } from '../qaCalculatorUtilities.js';
import {
  calcLabel,
  answerable as answerableStyle,
  col50,
  col50MarginRight,
  marginTop,
} from '../qaCalculator.module.scss';

class SizeCalculator extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: {
        magnitude: null,
        albedo: null,
        diameter: null,
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
    const { magnitude, albedo, diameter } = data || {};

    this.checkAnswerable(answerable, activeId === id);

    this.setState(prevState => ({
      ...prevState,
      value: {
        magnitude,
        albedo,
        diameter,
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
      diameter: calculateDiameter(newVal),
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
      value: { magnitude, albedo, diameter },
    } = this.state;

    const { id, label: labelText } = question;
    const active = activeId === id;
    const answered = !isEmpty(answer);
    const answeredClasses = {
      answered,
      unanswered: !answered,
      [answerableStyle]: answerable || answered || active,
    };
    const fieldClasses = classnames('qa-calc-input', answeredClasses);
    const labelClasses = classnames(calcLabel, answeredClasses);

    return (
      <CardText>
        <QACalculatorLabel
          inputId={`text-input-${id}-magnitude`}
          {...{ labelText, labelClasses }}
        />
        <div className="container-flex">
          <QACalculatorInput
            containerWidth={col50MarginRight}
            id={`text-input-${id}-magnitude`}
            className={fieldClasses}
            leftIcon={<QACalculatorIcon content="H =" />}
            placeholder="magnitude"
            defaultValue={answered ? magnitude : null}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={debounce(
              value => this.handleChange(value, 'magnitude'),
              400
            )}
            disabled={!(answerable || answered || active)}
          />
          <QACalculatorInput
            containerWidth={col50}
            id={`text-input-${id}-albedo`}
            className={fieldClasses}
            leftIcon={<QACalculatorIcon content="p =" />}
            placeholder="albedo"
            defaultValue={answered ? albedo : null}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={debounce(
              value => this.handleChange(value, 'albedo'),
              400
            )}
            disabled={!(answerable || answered || active)}
          />
        </div>
        <div className={marginTop}>
          <FindDiameter {...{ diameter, magnitude, albedo }} />
        </div>
      </CardText>
    );
  }
}

SizeCalculator.propTypes = {
  activeId: PropTypes.string,
  question: PropTypes.object,
  answerHandler: PropTypes.func,
  focusCallback: PropTypes.func,
  answer: PropTypes.object,
};

export default SizeCalculator;
