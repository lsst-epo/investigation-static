import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { TextField } from 'react-md';

class FillableTableTextInput extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: undefined,
      hasFocus: false,
      answerable: false,
    };
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
        {qaReview && <span>{answer.content}</span>}
        {!qaReview && (
          <TextField
            id={`text-input-${id}`}
            type="text"
            defaultValue={answered ? answer.content : ''}
            lineDirection="center"
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={this.handleChange}
            disabled={!(answerable || answered || active)}
          />
        )}
      </>
    );
  }
}

FillableTableTextInput.propTypes = {
  activeId: PropTypes.string,
  question: PropTypes.object,
  focusCallback: PropTypes.func,
  answerHandler: PropTypes.func,
  answer: PropTypes.object,
};

export default FillableTableTextInput;
