/* eslint-disable react/jsx-props-no-spreading */
import React from 'reactn';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import isObject from 'lodash/isObject';
import { qById, getActiveQ } from '../components/qas/utilities.js';

export const WithQAing = ComposedComponent => {
  class WrappedComponent extends React.PureComponent {
    // Methods related to setting & updating "active QA"

    // Callback method passed down to child components
    setActiveQuestion = activeQuestionId => {
      this.dispatch.setActiveQuestionId(activeQuestionId);
    };

    // Callback method passed down to child components
    advanceActiveQuestion = () => {
      const { questions } = this.props;
      const { answers } = this.global;
      const activeQ = getActiveQ(questions, answers);

      this.setActiveQuestion(activeQ ? activeQ.id : null);
    };

    // Methods related to updating answers

    // Callback method passed down to child components
    answerHandler = (id, data, eventType) => {
      if ((id && data) || eventType) {
        const { questions } = this.props;
        const answeredQuestion = qById(questions, id);
        const { answerAccessor } = answeredQuestion;
        let content = data;
        if (answerAccessor === 'text') {
          content = data || '';
          content = isObject(content) ? '' : content;
        } else if (
          answerAccessor === 'compound-select' ||
          answerAccessor === 'select'
        ) {
          content = data;
          content = isObject(content) ? 'DEFAULT' : content;
        } else if (answerAccessor === 'count') {
          content = data.length;
        } else if (!includes(answerAccessor, 'range')) {
          content = data[0] ? data[0][answerAccessor] : 'None Selected';
        }

        this.dispatch.updateAnswer(id, content, data);
      } else {
        this.dispatch.clearAnswer(id);
      }
    };

    updateAnswer = (id, value, type) => {
      if (type !== 'focus') {
        this.answerHandler(id, value, type);
      }

      if (type === 'focus') {
        this.setActiveQuestion(id);
      }

      if (type === 'change' || type === 'blur') {
        this.advanceActiveQuestion();
      }
    };

    render() {
      const { activeQuestionId, answers } = this.global;

      return (
        <ComposedComponent
          {...this.props}
          answers={answers}
          activeQuestionId={activeQuestionId}
          updateAnswer={this.updateAnswer}
          advanceActiveQuestion={this.advanceActiveQuestion}
          setActiveQuestion={this.setActiveQuestion}
        />
      );
    }
  }

  WrappedComponent.propTypes = {
    questions: PropTypes.array,
  };

  return WrappedComponent;
};

export default WithQAing;
