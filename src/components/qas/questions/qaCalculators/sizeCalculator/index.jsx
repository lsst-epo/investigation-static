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
    if (!magnitude || !albedo) return null;

    return formatValue(
      (1329 / Math.sqrt(albedo)) * 10 ** (-0.2 * magnitude),
      3
    );
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
      diameter: this.calculateDiameter(newVal),
    };
  }

  handleFocus = () => {
    this.setState(prevState => ({
      ...prevState,
      hasFocus: true,
    }));
  };

  handleBlur = () => {
    this.setState(prevState => ({
      ...prevState,
      hasFocus: false,
    }));
  };

  handleChange = (value, valType) => {
    const { question, answerHandler } = this.props;
    const { id } = question;

    this.setState(
      prevState => ({
        ...prevState,
        hasFocus: true,
        value: {
          ...this.getNewVal(value, valType),
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
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onChange={value => this.handleChange(value, 'magnitude')}
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
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onChange={value => this.handleChange(value, 'albedo')}
              disabled={!(answerable || answered || active)}
            />
          </div>
          <div className={styles.marginTop}>
            <Equation
              component="FindDiameter"
              {...{ diameter, magnitude, albedo }}
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
