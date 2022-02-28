import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { TextField } from 'react-md';
import ButtonIcon from '../../../site/button/ButtonIcon';
import Edit from '../../../site/icons/Edit';

class FillableTableTextInput extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: undefined,
      hasFocus: false,
      editing: false,
    };

    this.inputRef = createRef(null);
  }

  componentDidMount = () => {
    const { answer } = this.props;
    const answered = !isEmpty(answer);

    this.setState(prevState => ({
      ...prevState,
      value: answered ? answer.content : undefined,
    }));
  };

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
      this.inputRef.current.focus();
    }
  };

  handleChange = value => {
    const { question, answerHandler } = this.props;
    const { id } = question;
    const { value: oldValue } = this.state;

    if (!oldValue) {
      answerHandler(id, value, 'change');
    }

    this.setState(prevState => ({
      ...prevState,
      value,
    }));
  };

  handleBlur = () => {
    this.updateFocus(false);
    this.updateEditing(false);
  };

  handleEditClick = () => {
    this.updateEditing(true);
  };

  handleFocus = () => {
    this.updateFocus(true);
  };

  render() {
    const { question, answer } = this.props;
    const { editing } = this.state;
    const { id, qaReview } = question;
    const answered = !isEmpty(answer);

    return (
      <div className="table-cell-text-input">
        {qaReview && <span>{answered ? answer.content : ''}</span>}
        {!qaReview && !editing && (
          <button
            type="button"
            className="table-cell-input-button"
            onClick={this.handleEditClick}
          >
            <span>{answered ? answer.content : ''}</span>
            <ButtonIcon srText="Edit" Icon={Edit} />
          </button>
        )}
        {!qaReview && editing && (
          <TextField
            id={`text-input-${id}`}
            type="text"
            defaultValue={answered ? answer.content : ''}
            lineDirection="center"
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={this.handleChange}
            ref={this.inputRef}
          />
        )}
      </div>
    );
  }
}

FillableTableTextInput.propTypes = {
  question: PropTypes.object,
  focusCallback: PropTypes.func,
  answerHandler: PropTypes.func,
  answer: PropTypes.object,
};

export default FillableTableTextInput;
