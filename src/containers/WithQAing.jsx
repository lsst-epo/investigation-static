/* eslint-disable react/jsx-props-no-spreading */
import React from 'reactn';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import isObject from 'lodash/isObject';
import { qById, getActiveQ } from '../components/qas/utilities.js';

export const WithQAing = ComposedComponent => {
  class WrappedComponent extends React.PureComponent {
    constructor(props) {
      super(props);

      this.answerAccessorGets = {
        text: this.getTextContent,
        'compound-select': this.getSelectContent,
        select: this.getSelectContent,
        count: this.getCountContent,
        'light-curve-template': this.getTemplateContent,
        magnitude: this.getMagnitudeContent,
      };
    }

    componentDidMount() {
      const { answers } = this.global;
      const { data: pageData } = this.props;
      const { questionsByPage: questions } = pageData.allPagesJson.nodes[0];
      const activeQ = getActiveQ(questions, answers);

      if (questions) {
        this.setActiveQuestion(
          activeQ ? activeQ.id : questions[0].question[0].id
        );
      }
    }

    // Methods related to setting & updating "active QA"

    // Callback method passed down to child components
    setActiveQuestion = activeQuestionId => {
      this.dispatch.setActiveQuestionId(activeQuestionId);
    };

    // Callback method passed down to child components
    advanceActiveQuestion = () => {
      const { data: pageData } = this.props;
      const { questionsByPage: questions } = pageData.allPagesJson.nodes[0];

      const { answers } = this.global;
      const activeQ = getActiveQ(questions, answers);

      this.setActiveQuestion(activeQ ? activeQ.id : null);
    };

    // Methods related to updating answers

    getSelectContent(data) {
      return isObject(data) ? 'DEFAULT' : data;
    }

    getTemplateContent(data) {
      return data.type || 'None Selected';
    }

    getMagnitudeContent(data) {
      return data.magnitude || 'None Selected';
    }

    getCountContent(data) {
      return data.length;
    }

    getTextContent(data) {
      const content = data || '';
      return isObject(content) ? '' : content;
    }

    getRangeContent(data, answerAccessor) {
      return data[0] ? data[0][answerAccessor] : 'None Selected';
    }

    getContent(answerAccessor, data) {
      const getFunc = this.answerAccessorGets[answerAccessor];

      if (getFunc) {
        return getFunc(data) || data;
      }

      if (!includes(answerAccessor, 'range')) {
        return this.getRangeContent(data, answerAccessor);
      }

      return data;
    }

    // Callback method passed down to child components
    answerHandler = (id, data, eventType) => {
      if ((id && data) || eventType) {
        const { data: pageData } = this.props;
        const { questionsByPage: questions } = pageData.allPagesJson.nodes[0];
        const { answerAccessor } = qById(questions, id);
        const content = this.getContent(answerAccessor, data);

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
      const { activeQuestionId, answers, activeAnswer } = this.global;

      return (
        <ComposedComponent
          {...this.props}
          {...{ answers, activeAnswer, activeQuestionId }}
          updateAnswer={this.updateAnswer}
          advanceActiveQuestion={this.advanceActiveQuestion}
          setActiveQuestion={this.setActiveQuestion}
        />
      );
    }
  }

  WrappedComponent.propTypes = {
    questions: PropTypes.array,
    data: PropTypes.object,
  };

  return WrappedComponent;
};

export default WithQAing;
