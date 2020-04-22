import React from 'react';
import PropTypes from 'prop-types';
import QA from './QA';
import QACompound from './questions/qaCompound';
import './styles.module.scss';

class QAs extends React.PureComponent {
  render() {
    const {
      questions,
      answers,
      activeQuestionId,
      updateAnswer,
      advanceActiveQuestion,
      setActiveQuestion,
    } = this.props;

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
                <QACompound
                  activeId={activeQuestionId}
                  questions={q}
                  answers={answers}
                  handleAnswerSelect={updateAnswer}
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
              activeId={activeQuestionId}
              answerHandler={updateAnswer}
              cancelHandler={updateAnswer}
              saveHandler={advanceActiveQuestion}
              editHandler={setActiveQuestion}
            />
          );
        })}
      </div>
    );
  }
}

QAs.propTypes = {
  questions: PropTypes.array,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  updateAnswer: PropTypes.func,
  advanceActiveQuestion: PropTypes.func,
  setActiveQuestion: PropTypes.func,
};

export default QAs;
