/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import TextField from '../../../site/forms/textField';
import Card from '../../../site/card';
import { renderDef } from '../../../../lib/utilities.js';
import './styles.module.scss';

class TextInput extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: undefined,
    };
  }

  handleChange = value => {
    const { question, answerHandler } = this.props;
    const { id } = question;
    const { value: oldValue } = this.state;

    if (!oldValue) {
      answerHandler(id, value, 'change');
    }

    this.setState({ value });
  };

  handleBlur = () => {
    const { question, answerHandler } = this.props;
    const { id } = question;
    const { value } = this.state;

    answerHandler(id, value, 'blur');
  };

  handleFocus = () => {
    const { question, activeId, answerHandler } = this.props;
    const { id } = question;
    const { value } = this.state;

    if (activeId !== id) {
      answerHandler(id, value, 'focus');
    }
  };

  render() {
    const { question, answer, activeId } = this.props;
    const { id, questionType, label, placeholder } = question;
    const isTextArea = questionType === 'textArea';
    const active = activeId === id;
    const answered = !isEmpty(answer);
    const dynamicClasses = {
      active,
      answered,
      unanswered: !answered,
    };
    const fieldClasses = classnames('qa-text-input', dynamicClasses);
    const cardClasses = classnames('qa-card', dynamicClasses);

    return (
      <Card className={cardClasses}>
        <TextField
          id={`text-${isTextArea ? 'area' : 'input'}-${id}`}
          className={fieldClasses}
          type="text"
          label={<div dangerouslySetInnerHTML={renderDef(label)} />}
          lineDirection="center"
          placeholder={placeholder}
          rows={1}
          maxRows={isTextArea ? 8 : 1}
          defaultValue={answered ? answer.content : ''}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          disabled={!active && !answered}
        />
      </Card>
    );
  }
}

TextInput.propTypes = {
  activeId: PropTypes.string,
  question: PropTypes.object,
  answerHandler: PropTypes.func,
  answer: PropTypes.object,
};

export default TextInput;
