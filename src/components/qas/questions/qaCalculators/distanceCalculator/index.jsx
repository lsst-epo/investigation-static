/* eslint-disable react/no-danger */
import React from 'react';
import { CardText, CardActions } from 'react-md';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import CalculatedMeasurement from './CalculatedMeasurement';
import Equation from '../shared/equation';
import TextField from '../../../../site/forms/textField';
import Card from '../../../../site/card';
import { addTheCommas, renderDef } from '../../../../../lib/utilities.js';
import {
  solveForDistanceModulus,
  solveForParsecs,
  solveForMegaParsecs,
  solveForLightYears,
  solveForMegaLightYears,
} from './distanceCalculatorUtilities.js';
import { inlineQuestion } from './distanceCalculator.module.scss';
import styles from '../../../styles.module.scss';
import { qaCalc } from '../shared/calculator.module.scss';

const LeftIcon = () => {
  return <div>m =</div>;
};

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

  getCalculatedMeasurements(value) {
    const magnitude = +value !== 0 ? +value : 'm';
    const distanceModulus =
      +value !== 0 ? +solveForDistanceModulus(+magnitude) : 'DM';
    const parsecs = +value !== 0 ? +solveForParsecs(+distanceModulus) : '?';
    const megaParsecs = +value !== 0 ? +solveForMegaParsecs(+parsecs) : '?';
    const lightYears = +value !== 0 ? solveForLightYears(+parsecs) : '?';
    const megaLightYears =
      +value !== 0 ? +solveForMegaLightYears(+lightYears) : '?';

    return {
      magnitude,
      distanceModulus,
      parsecs,
      megaParsecs,
      lightYears,
      megaLightYears,
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

  handleChange = value => {
    const { question, answerHandler } = this.props;
    const { id } = question;

    this.setState(
      prevState => ({
        ...prevState,
        hasFocus: true,
        value: {
          ...this.getCalculatedMeasurements(value),
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

    const { id, label, placeholder } = question;
    const active = activeId === id;
    const answered = !isEmpty(answer);
    const cardClasses = classnames(styles.qaCard, qaCalc, {
      [styles.active]: hasFocus,
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
          <div className={inlineQuestion}>
            <TextField
              id={`text-input-${id}`}
              className={fieldClasses}
              type="number"
              min="0"
              leftIcon={<LeftIcon />}
              label={<div dangerouslySetInnerHTML={renderDef(label)} />}
              lineDirection="center"
              placeholder={placeholder}
              defaultValue={answered ? magnitude : null}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onChange={debounce(this.handleChange, 400)}
              disabled={!(answerable || answered || active)}
            />
          </div>
        </CardText>
        <CardActions expander style={{ display: 'none' }} />
        <CardText expandable>
          <Equation
            component="FindDistanceModulus"
            solution="DM"
            variable={addTheCommas(magnitude || '')}
            equation=" + 19.4"
          />
          <Equation
            component="FindParsecs"
            solution="d"
            equation="10 "
            variable={addTheCommas(distanceModulus || '')}
            numerator="+ 5"
            denominator="5"
          />
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
  answer: PropTypes.object,
};

export default DistanceCalculator;
