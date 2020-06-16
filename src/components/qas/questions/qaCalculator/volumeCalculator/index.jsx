/* eslint-disable react/no-danger */
import React from 'react';
import { CardText } from 'react-md';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import { calculateVolume } from '../qaCalculatorUtilities';
import FindVolume from './FindVolume';
import QACalculatorLabel from '../qaCalculatorLabel';
import QACalculatorInput from '../qaCalculatorInput';
import { QACalculatorIcon, QACalculatorIconUnit } from '../qaCalculatorIcons';
import {
  calcLabel,
  answerable as answerableStyle,
  marginTop,
  col50,
} from '../qaCalculator.module.scss';

class VolumeCalculator extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: {
        volume: null,
        radius: null,
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
    const { radius, volume } = data || {};

    this.checkAnswerable(answerable, activeId === id);

    this.setState(prevState => ({
      ...prevState,
      value: {
        radius,
        volume,
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
      volume: calculateVolume(newVal),
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

  render() {
    const { question, answer, activeId } = this.props;
    const {
      answerable,
      value: { radius, volume },
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
        <QACalculatorInput
          containerWidth={col50}
          id={`number-input-${id}`}
          className={fieldClasses}
          leftIcon={<QACalculatorIcon content="r =" />}
          rightIcon={<QACalculatorIconUnit unit=" km" />}
          placeholder="radius"
          defaultValue={answered ? radius : null}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onChange={debounce(value => this.handleChange(value, 'radius'), 400)}
          disabled={!(answerable || answered || active)}
        />
        <div className={marginTop}>
          <FindVolume {...{ radius, volume }} />
        </div>
      </CardText>
    );
  }
}

VolumeCalculator.propTypes = {
  activeId: PropTypes.string,
  question: PropTypes.object,
  answerHandler: PropTypes.func,
  focusCallback: PropTypes.func,
  answer: PropTypes.object,
};

export default VolumeCalculator;
