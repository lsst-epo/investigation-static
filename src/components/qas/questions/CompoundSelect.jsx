import React from 'react';
import PropTypes from 'prop-types';
import QASelect from './QASelect';

class QuestionCompoundSelect extends React.PureComponent {
  render() {
    const { questions, activeId, answers, handleAnswerSelect } = this.props;
    const ids = questions.map(question => {
      return question.id;
    });

    return (
      <div className="qa-compound-select">
        {questions.map(question => {
          const { id } = question;

          return (
            <QASelect
              key={id}
              ids={ids}
              question={question}
              answer={answers[id]}
              handleAnswerSelect={handleAnswerSelect}
              activeId={activeId}
            />
          );
        })}
      </div>
    );
  }
}

QuestionCompoundSelect.propTypes = {
  handleAnswerSelect: PropTypes.func,
  questions: PropTypes.array,
  answers: PropTypes.array,
  activeId: PropTypes.string,
};

export default QuestionCompoundSelect;
