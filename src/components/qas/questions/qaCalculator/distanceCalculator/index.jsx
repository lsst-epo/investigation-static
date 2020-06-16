/* eslint-disable react/no-danger */
import React from 'react';
import { CardText, CardActions } from 'react-md';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import Card from '../../../../site/card';
import CalculatedMeasurement from './CalculatedMeasurement';
import FindDistanceModulus from './FindDistanceModulus';
import FindParsecs from './FindParsecs';
import { QACalculatorIcon } from '../qaCalculatorIcons';
import QACalculatorLabel from '../qaCalculatorLabel';
import { getCalculatedMeasurementsForDistance } from '../qaCalculatorUtilities.js';
import { calcLabel, col50, qaCalc } from '../qaCalculator.module.scss';
import styles from '../../../styles.module.scss';
import QACalculatorInput from '../qaCalculatorInput';

class DistanceCalculator extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: {
        magnitude: null,
        distanceModulus: null,
        parsecs: null,
        megaParsecs: null,
        lightYears: null,
        megaLightYears: null,
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
    const {
      magnitude,
      distanceModulus,
      parsecs,
      megaParsecs,
      lightYears,
      megaLightYears,
    } = data || {};

    this.checkAnswerable(answerable, activeId === id);

    this.setState(prevState => ({
      ...prevState,
      value: {
        magnitude,
        distanceModulus,
        parsecs,
        megaParsecs,
        lightYears,
        megaLightYears,
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

  handleChange = value => {
    const { question, answerHandler } = this.props;
    const { id } = question;

    this.setState(
      prevState => ({
        ...prevState,
        hasFocus: true,
        value: {
          ...getCalculatedMeasurementsForDistance(+value),
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
    const { hasFocus, answerable, value } = this.state;
    const {
      magnitude,
      distanceModulus,
      parsecs,
      megaParsecs,
      lightYears,
      megaLightYears,
    } = value || {};

    const { id, label } = question;
    const active = activeId === id;
    const answered = !isEmpty(answer);
    const answeredClasses = {
      answered,
      unanswered: !answered,
      answerable: answerable || answered || active,
    };
    const cardClasses = classnames(styles.qaCard, qaCalc, {
      [styles.active]: hasFocus,
    });
    const fieldClasses = classnames('qa-text-input', answeredClasses);
    const labelClasses = classnames(calcLabel, answeredClasses);

    return (
      <Card
        className={cardClasses}
        expanded={hasFocus}
        onExpanderClick={() => {}}
      >
        <CardText>
          <QACalculatorLabel {...{ label, labelClasses }} />
          <QACalculatorInput
            containerWidth={col50}
            id={`text-input-${id}`}
            className={fieldClasses}
            leftIcon={<QACalculatorIcon content="m =" />}
            placeholder="magnitude"
            defaultValue={answered ? magnitude : null}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={debounce(this.handleChange, 400)}
            disabled={!(answerable || answered || active)}
          />
        </CardText>
        <CardActions expander style={{ display: 'none' }} />
        <CardText expandable>
          <FindDistanceModulus variable={magnitude} />
          <FindParsecs variable={distanceModulus} />
          <div className="results-list">
            <CalculatedMeasurement unit="pc" value={parsecs} />
            <CalculatedMeasurement unit="Mpc" value={megaParsecs} />
            <CalculatedMeasurement unit="ly" value={lightYears} />
            <CalculatedMeasurement unit="Mly" value={megaLightYears} />
          </div>
        </CardText>
      </Card>
    );
  }
}

DistanceCalculator.propTypes = {
  activeId: PropTypes.string,
  question: PropTypes.object,
  answerHandler: PropTypes.func,
  focusCallback: PropTypes.func,
  answer: PropTypes.object,
};

export default DistanceCalculator;
