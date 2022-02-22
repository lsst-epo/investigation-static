/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import QA from '../../qas/QA';
import QACompound from '../../qas/questions/qaCompound';
import { qa } from '../../qas/styles.module.scss';

import { gridQasTop, gridQasMiddle, gridQasBottom } from '../page.module.scss';

class QuestionBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.gridClasses = {
      top: gridQasTop,
      middle: gridQasMiddle,
      bottom: gridQasBottom,
    };
  }

  render() {
    const { blockShared, block } = this.props;
    const { question: q, number, tables } = block;
    const primeQ = q[0];
    const { id, questionType, qaReview, showUserAnswer } = primeQ;
    const key = `qa-${id}`;

    const {
      activeQuestionId,
      advanceActiveQuestion,
      answers,
      qaReviewPage,
      setActiveQuestion,
      updateAnswer,
    } = blockShared;

    if (qaReviewPage && !qaReview) return false;

    if (q.length > 1) {
      return (
        <div className="qas">
          <div className={qa} key={key}>
            <QACompound
              activeId={activeQuestionId}
              questionNumber={+number}
              questions={q}
              tables={tables}
              answers={answers}
              handleAnswerSelect={updateAnswer}
            />
          </div>
        </div>
      );
    }

    const answer = answers[id];
    const prepopulateAnswer = answers[showUserAnswer];

    return (
      <div className="qas">
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
      </div>
    );
  }
}

QuestionBlock.propTypes = {
  blockShared: PropTypes.object,
  block: PropTypes.object,
};

export default QuestionBlock;
