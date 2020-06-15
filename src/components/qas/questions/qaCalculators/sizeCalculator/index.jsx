/* eslint-disable react/no-danger */
import React from 'react';
import { CardText } from 'react-md';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import Equation from '../shared/equation';
import TextField from '../../../../site/forms/textField';
import Card from '../../../../site/card';
import { renderDef, formatValue } from '../../../../../lib/utilities.js';
import styles from './sizeCalculator.module.scss';
import qaStyles from '../../../styles.module.scss';
import {
  qaCalc,
  calcLabel,
  answerable as answerableStyle,
} from '../shared/calculator.module.scss';

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
      hasFocus,
      answerable,
      value: { magnitude, albedo, diameter },
    } = this.state;

    const { id, label } = question;
    const active = activeId === id;
    const answered = !isEmpty(answer);
    const answeredClasses = {
      answered,
      unanswered: !answered,
      [answerableStyle]: answerable || answered || active,
    };
    const cardClasses = classnames(qaStyles.qaCard, qaCalc, {
      [qaStyles.active]: hasFocus,
    });
    const fieldClasses = classnames('qa-calc-input', answeredClasses);
    const labelClasses = classnames(calcLabel, answeredClasses);

    return (
      <Card
        className={cardClasses}
        expanded={hasFocus}
        onExpanderClick={() => {}}
      >
        <CardText>
          <div
            className={labelClasses}
            dangerouslySetInnerHTML={renderDef(label)}
          />
          <div className="container-flex">
            <div className="col-width-50">
              <TextField
                id={`text-input-${id}`}
                className={fieldClasses}
                type="number"
                min="0"
                leftIcon={<HIcon />}
                lineDirection="center"
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
            </div>
            <div className="col-width-50">
              <TextField
                id={`text-input-${id}`}
                className={fieldClasses}
                type="number"
                min="0"
                leftIcon={<PIcon />}
                lineDirection="center"
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
          </div>
          <div className={styles.equationWrapper}>
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
