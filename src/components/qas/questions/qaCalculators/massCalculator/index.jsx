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
import styles from './massCalculator.module.scss';
import qaStyles from '../../../styles.module.scss';
import { qaCalc } from '../shared/calculator.module.scss';

const VolumeIcon = () => {
  return <span className={styles.icon}>v =</span>;
};

const DensityIcon = () => {
  return <span className={styles.icon}>p =</span>;
};

class MassCalculator extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: {
        mass: null,
        volume: null,
        density: null,
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
    const { mass, volume, density } = data || {};

    this.checkAnswerable(answerable, activeId === id);

    this.setState(prevState => ({
      ...prevState,
      value: {
        mass,
        volume,
        density,
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

  calculateMass({ density, volume }) {
    if (!density || !volume) return null;

    return density * volume;
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
      mass: this.calculateMass(newVal),
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
      hasFocus,
      answerable,
      value: { mass, volume, density },
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
          <div className={styles.col50}>
            <TextField
              id={`number-input-${id}`}
              className={fieldClasses}
              type="number"
              min="0"
              leftIcon={<DensityIcon />}
              lineDirection="center"
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
          </div>
          <div className={styles.col50}>
            <TextField
              id={`number-input-${id}`}
              className={fieldClasses}
              type="number"
              min="0"
              leftIcon={<VolumeIcon />}
              lineDirection="center"
              placeholder="volume"
              defaultValue={answered ? volume : null}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onChange={debounce(
                value => this.handleChange(value, 'volume'),
                400
              )}
              disabled={!(answerable || answered || active)}
            />
          </div>
          <div className={styles.marginTop}>
            <Equation component="FindMass" {...{ density, mass, volume }} />
          </div>
        </CardText>
      </Card>
    );
  }
}

MassCalculator.propTypes = {
  activeId: PropTypes.string,
  question: PropTypes.object,
  answerHandler: PropTypes.func,
  answer: PropTypes.object,
};

export default MassCalculator;
