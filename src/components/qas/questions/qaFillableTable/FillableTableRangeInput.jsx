import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { TextField } from 'react-md';
import StellarValueRange from '../../../charts/shared/StellarValueRange';

class FillableTableRangeInput extends React.PureComponent {
  constructor(props) {
    super(props);

    const { answer } = props;

    this.state = {
      minValue: answer.data[0] || undefined,
      maxValue: answer.data[1] || undefined,
      hasFocus: false,
      answerable: false,
    };
  }

  updateFocus(focusStatus) {
    const { question, focusCallback, answerHandler } = this.props;
    const { id } = question;
    const { minValue, maxValue } = this.state;
    const rangeValue = [minValue, maxValue];

    answerHandler(id, rangeValue || ' ', focusStatus ? 'focus' : 'blur');

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

  handleMinChange = value => {
    const { question, answerHandler } = this.props;
    const { id } = question;
    const { minValue: oldMinValue, maxValue } = this.state;
    const rangeValue = [value, maxValue];

    if (!oldMinValue) {
      answerHandler(id, rangeValue, 'change');
    }

    this.setState(prevState => ({
      ...prevState,
      minValue: value,
    }));
  };

  handleMaxChange = value => {
    const { question, answerHandler } = this.props;
    const { id } = question;
    const { minValue, maxValue: oldMaxValue } = this.state;
    const rangeValue = [minValue, value];

    if (!oldMaxValue) {
      answerHandler(id, rangeValue, 'change');
    }

    this.setState(prevState => ({
      ...prevState,
      maxValue: value,
    }));
  };

  handleBlur = () => {
    this.updateFocus(false);
  };

  handleFocus = () => {
    this.updateFocus(true);
  };

  render() {
    const { question, answer, activeId } = this.props;
    const { answerable } = this.state;
    const { id, qaReview } = question;
    const active = activeId === id;
    const answered = !isEmpty(answer);
    return (
      <>
        {qaReview && <StellarValueRange data={answer.data} />}
        {!qaReview && (
          <div className="table-cell-range-input">
            <TextField
              id={`range-input-${id}-min`}
              type="text"
              defaultValue={answered ? answer.data[0] : ''}
              lineDirection="center"
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onChange={this.handleMinChange}
              disabled={!(answerable || answered || active)}
              fullWidth={false}
            />
            <span>-</span>
            <TextField
              id={`range-input-${id}-max`}
              type="text"
              defaultValue={answered ? answer.data[1] : ''}
              lineDirection="center"
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onChange={this.handleMaxChange}
              disabled={!(answerable || answered || active)}
              fullWidth={false}
            />
          </div>
        )}
      </>
    );
  }
}

FillableTableRangeInput.propTypes = {
  activeId: PropTypes.string,
  question: PropTypes.object,
  focusCallback: PropTypes.func,
  answerHandler: PropTypes.func,
  answer: PropTypes.object,
};

export default FillableTableRangeInput;
