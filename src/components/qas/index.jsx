import React from 'react';
import PropTypes from 'prop-types';
import QA from './QA';
import QACompoundSelect from './questions/qaCompoundSelect';
import './styles.module.scss';

class QAs extends React.PureComponent {
  updateAnswer = (id, value, type) => {
    const { answerHandler, setActive, advanceActive } = this.props;

    if (type !== 'focus') {
      answerHandler(id, value, type);
    }

    if (type === 'focus') {
      setActive(id);
    }

    if (type === 'change' || type === 'blur') {
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
