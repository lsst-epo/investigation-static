import React from 'reactn';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import isObject from 'lodash/isObject';

export const WithAnswerHandlers = ComposedComponent => {
  class WrappedComponent extends React.PureComponent {
    clearAnswer(id) {
      const { answers: prevAnswers } = this.global;

      this.setGlobal(prevGlobal => ({
        ...prevGlobal,
        answers: {
          ...prevAnswers,
          [id]: {},
        },
      }));
    }

    updateAnswer(id, data) {
      const { questions, questionsRange } = this.props;
      const activeIndex = questionsRange.indexOf(parseInt(id, 10));
      const { answerAccessor } = questions[activeIndex];
      const { answers: prevAnswers } = this.global;
      const prevAnswer = { ...prevAnswers[id] };
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

      this.setGlobal(prevGlobal => ({
        ...prevGlobal,
        answers: {
          ...prevAnswers,
          [id]: {
            ...prevAnswer,
            id,
            content,
            data,
          },
        },
      }));
    }

    answerHandler = (id, data, eventType) => {
      if ((id && data) || eventType) {
        this.updateAnswer(id, data);
      } else {
        this.clearAnswer(id);
      }
    };

    render() {
      return (
        <ComposedComponent {...this.props} answerHandler={this.answerHandler} />
      );
    }
  }

  WrappedComponent.propTypes = {
    questionsRange: PropTypes.array,
    questions: PropTypes.array,
  };

  return WrappedComponent;
};

export default WithAnswerHandlers;
