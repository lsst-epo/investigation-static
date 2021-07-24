import React from 'react';
import PropTypes from 'prop-types';
import QA from './QA';
import QACompound from './questions/qaCompound';
import { qa } from './styles.module.scss';

class QAs extends React.PureComponent {
  render() {
    const {
      questions,
      answers,
      activeQuestionId,
      updateAnswer,
      advanceActiveQuestion,
      setActiveQuestion,
      qaReviewPage,
    } = this.props;

    return (
      <div className="qas">
        {questions.map(question => {
          const { question: q, number } = question;
          const primeQ = q[0];
          const { id, questionType, qaReview, showUserAnswer } = primeQ;
          const key = `qa-${id}`;

          if (qaReviewPage && !qaReview) return false;

          if (q.length > 1) {
            return (
              <div className={qa} key={key}>
                <QACompound
                  activeId={activeQuestionId}
                  questionNumber={+number}
                  questions={q}
                  answers={answers}
                  handleAnswerSelect={updateAnswer}
                />
              </div>
            );
          }

          const answer = answers[id];
          const prepopulateAnswer = answers[showUserAnswer];

          return (
            <QA
              key={key}
              questionType={questionType}
              questionNumber={+number}
              question={primeQ}
              answer={answer}
              prepopulateAnswer={prepopulateAnswer}
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
  qaReviewPage: PropTypes.bool,
};

export default QAs;
