import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { TextField } from 'react-md';
import { withTranslation } from 'gatsby-plugin-react-i18next';
import ButtonIcon from '../../../site/button/ButtonIcon';
import Edit from '../../../site/icons/Edit';
import StellarValueRange from '../../../charts/shared/StellarValueRange';

class FillableTableRangeInput extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      minValue: undefined,
      maxValue: undefined,
      hasFocus: false,
      editing: false,
    };

    this.minRangeRef = createRef(null);
    this.maxRangeRef = createRef(null);
  }

  componentDidMount = () => {
    const { answer } = this.props;
    const answered = !isEmpty(answer);

    this.setState(prevState => ({
      ...prevState,
      minValue: answered ? answer.data[0] : undefined,
      maxValue: answered ? answer.data[1] : undefined,
    }));
  };

  focusTimeout;

  updateFocus = focusStatus => {
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
        const { hasFocus } = this.state;
        if (focusCallback) {
          focusCallback(hasFocus);
        }

        clearTimeout(this.focusTimeout);

        this.focusTimeout = setTimeout(() => {
          if (
            !hasFocus &&
            document.activeElement !== this.minRangeRef.current &&
            document.activeElement !== this.maxRangeRef.current
          ) {
            this.updateEditing(false);
          }
        });
      }
    );
  };

  updateEditing = editing => {
    this.setState(
      prevState => ({
        ...prevState,
        editing,
      }),
      this.focusInput
    );
  };

  focusInput = () => {
    const { editing } = this.state;
    if (editing) {
      this.minRangeRef.current.focus();
    }
  };

  handleEditClick = () => {
    this.updateEditing(true);
  };

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

  render = () => {
    const { question, answer, t } = this.props;
    const { editing } = this.state;
    const { id, qaReview } = question;
    const answered = !isEmpty(answer);
    return (
      <div className="table-cell-range-input">
        {qaReview && <StellarValueRange data={answered ? answer.data : []} />}
        {!qaReview && editing && (
          <>
            <TextField
              id={`range-input-${id}-min`}
              type="text"
              defaultValue={answered ? answer.data[0] : ''}
              lineDirection="center"
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onChange={this.handleMinChange}
              fullWidth={false}
              ref={this.minRangeRef}
            />
            <span> – </span>
            <TextField
              id={`range-input-${id}-max`}
              type="text"
              defaultValue={answered ? answer.data[1] : ''}
              lineDirection="center"
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onChange={this.handleMaxChange}
              fullWidth={false}
              ref={this.maxRangeRef}
            />
          </>
        )}
        {!qaReview && !editing && (
          <button
            type="button"
            className="table-cell-input-button"
            onClick={this.handleEditClick}
          >
            <StellarValueRange
              className="table-cell-static-range"
              data={answered ? answer.data : []}
            />
            <ButtonIcon srText={t('actions.edit')} Icon={Edit} />
          </button>
        )}
      </div>
    );
  };
}

FillableTableRangeInput.propTypes = {
  question: PropTypes.object,
  focusCallback: PropTypes.func,
  answerHandler: PropTypes.func,
  answer: PropTypes.object,
  t: PropTypes.func,
};

export default withTranslation('interface')(FillableTableRangeInput);
