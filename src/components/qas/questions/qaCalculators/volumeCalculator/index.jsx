/* eslint-disable react/no-danger */
import React from 'react';
import { CardText } from 'react-md';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import { renderDef } from '../../../../../lib/utilities.js';
import Equation from '../shared/equation';
import TextField from '../../../../site/forms/textField';
import Card from '../../../../site/card';
import styles from './volumeCalculator.module.scss';
import qaStyles from '../../../styles.module.scss';
import { qaCalc } from '../shared/calculator.module.scss';

const RadiusIcon = () => {
  return <span className={styles.icon}>r =</span>;
};

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

  calculateVolume({ radius }) {
    if (!radius) return null;

    return (4 / 3) * Math.PI * radius ** 3;
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
      volume: this.calculateVolume(newVal),
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
      value: { radius, volume },
    } = this.state;

    const { id, label } = question;
    const active = activeId === id;
    const answered = !isEmpty(answer);
    const answeredClasses = {
      answered,
      unanswered: !answered,
      [styles.answerable]: answerable || answered || active,
    };
    const cardClasses = classnames(qaStyles.qaCard, qaCalc, {
      [qaStyles.active]: hasFocus,
    });
    const fieldClasses = classnames('qa-text-input', answeredClasses);
    const labelClasses = classnames(styles.calcLabel, answeredClasses);

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
          <TextField
            id={`number-input-${id}`}
            className={fieldClasses}
            type="number"
            min="0"
            leftIcon={<RadiusIcon />}
            lineDirection="center"
            placeholder="radius"
            defaultValue={answered ? radius : null}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={debounce(
              value => this.handleChange(value, 'radius'),
              400
            )}
            disabled={!(answerable || answered || active)}
          />
          <div className={styles.marginTop}>
            <Equation component="FindVolume" {...{ radius, volume }} />
          </div>
        </CardText>
      </Card>
    );
  }
}

VolumeCalculator.propTypes = {
  activeId: PropTypes.string,
  question: PropTypes.object,
  answerHandler: PropTypes.func,
  answer: PropTypes.object,
};

export default VolumeCalculator;
