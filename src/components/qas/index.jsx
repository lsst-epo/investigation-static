import React from 'react';
import PropTypes from 'prop-types';
// import includes from 'lodash/includes';
// import { getCompoundQs } from '../../lib/utilities.js';
import QA from './QA';
import CompoundSelect from './questions/CompoundSelect';

class QAs extends React.PureComponent {
  updateAnswer = (id, value, type) => {
    const { answerHandler, advanceActive } = this.props;

    answerHandler(id, value, type);

    if (type === 'change') {
      advanceActive();
    }
  };

  render() {
    const {
      questions,
      answers,
      activeId,
      advanceActive,
      setActive,
    } = this.props;

    return (
      <div className="qas">
        {questions.map(question => {
          const q = question.question;
          const { id, questionType } = q[0];

          if (q.length > 1) {
            return (
              <div className="qa">
                <CompoundSelect
                  key={`qa-${id}`}
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
              key={`qa-${id}`}
              questionType={questionType}
              question={q}
              answer={answer}
              activeId={activeId}
              answerHandler={this.updateAnswer}
              cancelHandler={this.updateAnswer}
              saveHandler={advanceActive}
              editHandler={setActive}
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
  activeId: PropTypes.string,
  answerHandler: PropTypes.func,
  advanceActive: PropTypes.func,
  setActive: PropTypes.func,
};

export default QAs;
