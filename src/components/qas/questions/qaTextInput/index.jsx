/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import TextField from '../../../site/forms/textField';
import Card from '../../../site/card';
import ConditionalWrapper from '../../../ConditionalWrapper';
import { renderDef } from '../../../../lib/utilities.js';
import './styles.module.scss';

class TextInput extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: undefined,
      hasFocus: false,
      answerable: false,
    };
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

  updateFocus(isFocus) {
    const { question, answerHandler } = this.props;
    const { id } = question;
    const { value } = this.state;

    answerHandler(id, value || ' ', isFocus ? 'focus' : 'blur');

    this.setState(prevState => ({
      ...prevState,
      hasFocus: isFocus,
    }));
  }

  handleBlur = () => {
    this.updateFocus(false);
  };

  handleFocus = () => {
    this.updateFocus(true);
  };

  render() {
    const { question, answer, activeId } = this.props;
    const { hasFocus, answerable } = this.state;
    const {
      id,
      questionType,
      label,
      placeholder,
      labelPre,
      labelPost,
    } = question;
    const isTextArea = questionType === 'textArea';
    const active = activeId === id;
    const answered = !isEmpty(answer);
    const cardClasses = classnames('qa-card', { active: hasFocus });
    const fieldClasses = classnames('qa-text-input', {
      answered,
      unanswered: !answered,
      answerable: answerable || answered || active,
      'inline-input': labelPre || labelPost,
    });

    return (
      <ConditionalWrapper
        condition={questionType !== 'compoundInput'}
        wrapper={children => <Card className={cardClasses}>{children}</Card>}
      >
        {labelPre && <span className="label-pre">{labelPre}&nbsp;</span>}
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
          disabled={!(answerable || answered || active)}
        />
        {labelPost && (
          <span className="label-pre">&nbsp;{labelPost}&nbsp;</span>
        )}
      </ConditionalWrapper>
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
