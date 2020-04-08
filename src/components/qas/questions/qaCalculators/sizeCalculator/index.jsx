/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-danger */
import React from 'react';
import { CardText } from 'react-md';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import Equation from '../shared/equation';
import TextField from '../../../../site/forms/textField';
import Card from '../../../../site/card';
import { renderDef, formatValue } from '../../../../../lib/utilities.js';
import styles from './sizeCalculator.module.scss';

const HIcon = () => {
  return <span className={styles.icon}>H =</span>;
};

const PIcon = () => {
  return <span className={styles.icon}>p =</span>;
};

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

  calculateDiameter({ magnitude, albedo }) {
    if (magnitude && albedo) {
      const diameter = formatValue(
        (1329 / Math.sqrt(albedo)) * 10 ** (-0.2 * magnitude),
        3
      );
      return diameter;
    }
    return null;
  }

  updateCalculatedMeasurements(value) {
    const { magnitude, albedo } = value;
    const diameter = this.calculateDiameter(value);
    this.setState(prevState => ({
      ...prevState,
      value: {
        magnitude,
        albedo,
        diameter,
      },
    }));
  }

  handleChangeMagnitude = value => {
    this.handleChange(value, 'magnitude');
  };

  handleChangeAlbedo = value => {
    this.handleChange(value, 'albedo');
  };

  handleChange = (value, index) => {
    const { question, answerHandler } = this.props;
    const { id } = question;
    const { value: oldValue } = this.state;
    const newVal = {
      ...oldValue,
      [index]: value,
    };

    if (newVal.magnitude && newVal.albedo) {
      answerHandler(id, newVal, 'change');
    }

    this.updateCalculatedMeasurements(newVal);
  };

  handleBlurMagnitude = ev => {
    const { value } = ev.currentTarget;
    this.handleBlurFocusEvent(value, 'magnitude', 'blur');
  };

  handleBlurAlbedo = ev => {
    const { value } = ev.currentTarget;
    this.handleBlurFocusEvent(value, 'albedo', 'blur');
  };

  handleFocusMagnitude = ev => {
    const { value } = ev.currentTarget;
    this.handleBlurFocusEvent(value, 'magnitude', 'focus');
  };

  handleFocusAlbedo = ev => {
    const { value } = ev.currentTarget;
    this.handleBlurFocusEvent(value, 'albedo', 'focus');
  };

  handleBlurFocusEvent = (value, index, eventType) => {
    const { question, answerHandler } = this.props;
    const { id } = question;
    const { value: oldValue } = this.state;
    const newVal = {
      ...oldValue,
      [index]: value,
    };

    if (newVal.magnitude && newVal.albedo) {
      answerHandler(id, newVal || {}, eventType);
    }

    this.setState(prevState => ({
      ...prevState,
      value: newVal,
      hasFocus: eventType === 'focus',
    }));
  };

  render() {
    const { question, answer, activeId } = this.props;
    const {
      // cardActive,
      hasFocus,
      answerable,
      value: { magnitude, albedo, diameter },
    } = this.state;

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
              defaultValue={answered ? magnitude : null}
              onBlur={this.handleBlurMagnitude}
              onFocus={this.handleFocusMagnitude}
              onChange={this.handleChangeMagnitude}
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
              onBlur={this.handleBlurAlbedo}
              onFocus={this.handleFocusAlbedo}
              onChange={this.handleChangeAlbedo}
              disabled={!(answerable || answered || active)}
            />
          </div>
          <div className={styles.marginTop}>
            <Equation
              component="FindDiameter"
              solution={diameter || 'D'}
              H={magnitude || 'H'}
              p={albedo || 'p'}
            />
          </div>
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
