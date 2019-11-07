import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import isObject from 'lodash/isObject';
import { qById, getActiveQ } from './utilities.js';
import QA from './QA';
import QACompoundSelect from './questions/qaCompoundSelect';
import './styles.module.scss';

@reactn
class QAs extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeId: null,
    };
  }

  componentDidMount() {
    const { questions } = this.props;
    const { answers } = this.global;
    const activeQuestion = getActiveQ(questions, answers);

    this.setState(prevState => ({
      ...prevState,
      questions,
      activeId: activeQuestion ? activeQuestion.id : null,
    }));
  }

  // Methods related to setting & updating "active QA"

  // Callback method passed down to child components
  setActiveQuestion = activeId => {
    // const { questions } = this.state;
    // const activeQ = qById(questions, activeId);

    this.setState(prevState => ({
      ...prevState,
      // activeQ,
      activeId,
    }));
  };

  // Callback method passed down to child components
  advanceActiveQuestion = () => {
    const { questions } = this.state;
    const { answers } = this.global;
    const activeQ = getActiveQ(questions, answers);

    this.setState(prevState => ({
      ...prevState,
      // activeQ,
      activeId: activeQ ? activeQ.id : null,
    }));
  };

  // Methods related to updating answers

  // Callback method passed down to child components
  answerHandler = (id, data, eventType) => {
    if ((id && data) || eventType) {
      const { questions } = this.state;
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
    const { activeId } = this.state;
    const { questions } = this.props;
    const { answers } = this.global;

    return (
      <div className="qas">
        {questions.map(question => {
          const q = question.question;
          const primeQ = q[0];
          const { id, questionType } = primeQ;
          const key = `qa-${id}`;

          if (q.length > 1) {
            return (
              <div className="qa" key={key}>
                <QACompoundSelect
                  activeId={activeId}
                  questions={q}
                  answers={answers}
                  handleAnswerSelect={this.updateAnswer}
                />
              </div>
            );
          }

          const answer = answers[id];

          return (
            <QA
              key={key}
              questionType={questionType}
              question={primeQ}
              answer={answer}
              activeId={activeId}
              answerHandler={this.updateAnswer}
              cancelHandler={this.updateAnswer}
              saveHandler={this.advanceActiveQuestion}
              editHandler={this.setActiveQuestion}
            />
          );
        })}
      </div>
    );
  }
}

QAs.propTypes = {
  questions: PropTypes.array,
};

export default QAs;
