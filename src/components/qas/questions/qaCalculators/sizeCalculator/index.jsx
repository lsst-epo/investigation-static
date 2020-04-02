/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-danger */
import React from 'react';
import { CardText, CardActions } from 'react-md';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
// import Calculation from '../shared/calculation';
import CalculatedMeasurement from '../shared/CalculatedMeasurement';
import Equation from '../shared/equation';
import TextField from '../../../../site/forms/textField';
import Card from '../../../../site/card';
import { renderDef, formatValue } from '../../../../../lib/utilities.js';
import './sizeCalculator.module.scss';

const HIcon = () => {
  return (
    <div>
      <strong>H</strong> =
    </div>
  );
};

const PIcon = () => {
  return (
    <div>
      <strong>p</strong> =
    </div>
  );
};

class SizeCalculator extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: undefined,
      cardActive: false,
      hasFocus: false,
      answerable: false,
    };
  }

  componentDidMount() {
    const { answerable, value } = this.state;
    const { question, activeId, answer } = this.props;
    const { id } = question;
    const calculateValue = isEmpty(answer) ? value : answer.content;

    this.checkAnswerable(answerable, activeId === id);
    this.updateCalculatedMeasurements(calculateValue);
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

  calculateDiameter(value) {
    if (value && value.h && value.p) {
      const diameter = formatValue(
        (1329 / Math.sqrt(value.p)) * 10 ** (-0.2 * value.h),
        3
      );
      return diameter;
    }
    return null;
  }

  updateCalculatedMeasurements(value) {
    const diameter = this.calculateDiameter(value);
    this.setState(prevState => ({
      ...prevState,
      value: { ...value, d: diameter },
    }));
  }

  handleHChange = value => {
    this.handleChange(value, 'h');
  };

  handlePChange = value => {
    this.handleChange(value, 'p');
  };

  handleChange = (value, index) => {
    const { question, answerHandler } = this.props;
    const { id } = question;
    const { value: oldValue } = this.state;
    const newVal = {
      ...oldValue,
      [index]: value,
    };

    if (newVal.h && newVal.p && newVal.d) {
      answerHandler(id, newVal, 'change');
    }

    this.updateCalculatedMeasurements(newVal);
  };

  handleHBlur = ev => {
    const { value } = ev.currentTarget;
    this.handleBlurFocusEvent(value, 'h', 'blur');
  };

  handlePBlur = ev => {
    const { value } = ev.currentTarget;
    this.handleBlurFocusEvent(value, 'p', 'blur');
  };

  handleHFocus = ev => {
    const { value } = ev.currentTarget;
    this.handleBlurFocusEvent(value, 'h', 'focus');
  };

  handlePFocus = ev => {
    const { value } = ev.currentTarget;
    this.handleBlurFocusEvent(value, 'p', 'focus');
  };

  handleBlurFocusEvent = (value, index, eventType) => {
    // TODO: Toggle expander onExpanderClick() to close
    const { question, answerHandler } = this.props;
    const { id } = question;
    const { value: oldValue } = this.state;
    const newVal = {
      ...oldValue,
      [index]: value,
    };
    answerHandler(id, newVal || ' ', eventType);

    this.setState(prevState => ({
      ...prevState,
      [index]: newVal,
      hasFocus: eventType === 'focus',
    }));
  };

  render() {
    const { question, answer, activeId } = this.props;
    const {
      // cardActive,
      hasFocus,
      answerable,
    } = this.state;

    const { data } = answer || {};
    const { h: absoluteMagnitude, p: albedo, d: diameter } = data || {};

    const { id, questionType, label, placeholder } = question;
    const isTextArea = questionType === 'textArea';
    const active = activeId === id;
    const answered = !isEmpty(answer);
    const cardClasses = classnames('qa-card', {
      active: hasFocus /* || cardActive */,
    });
    const fieldClasses = classnames('qa-text-input', {
      answered,
      unanswered: !answered,
      answerable: answerable || answered || active,
    });

    return (
      <Card
        className={cardClasses}
        expanded={hasFocus}
        onExpanderClick={() => {}}
      >
        <CardText>
          <div className="col-50">
            <TextField
              id={`text-${isTextArea ? 'area' : 'input'}-${id}`}
              className={fieldClasses}
              type="number"
              min="0"
              leftIcon={<HIcon />}
              label={<div dangerouslySetInnerHTML={renderDef(label)} />}
              lineDirection="center"
              placeholder={placeholder}
              defaultValue={answered ? absoluteMagnitude : null}
              onBlur={this.handleHBlur}
              onFocus={this.handleHFocus}
              onChange={this.handleHChange}
              disabled={!(answerable || answered || active)}
            />
          </div>
          <div className="col-50">
            <TextField
              id={`text-${isTextArea ? 'area' : 'input'}-${id}`}
              className={fieldClasses}
              type="number"
              min="0"
              leftIcon={<PIcon />}
              label={<div dangerouslySetInnerHTML={renderDef(label)} />}
              lineDirection="center"
              placeholder={placeholder}
              defaultValue={answered ? albedo : null}
              onBlur={this.handlePBlur}
              onFocus={this.handlePFocus}
              onChange={this.handlePChange}
              disabled={!(answerable || answered || active)}
            />
          </div>
          <div className="results-list">
            <CalculatedMeasurement unit="D" value={diameter} />
          </div>
        </CardText>
        <CardActions expander style={{ display: 'none' }} />
        <CardText expandable>
          <Equation
            component="FindDiameter"
            solution={diameter || 'D'}
            H={absoluteMagnitude || 'H'}
            p={albedo || 'p'}
          />
        </CardText>
      </Card>
    );
  }
}

SizeCalculator.propTypes = {
  activeId: PropTypes.string,
  question: PropTypes.object,
  answerHandler: PropTypes.func,
  answer: PropTypes.object,
};

export default SizeCalculator;
