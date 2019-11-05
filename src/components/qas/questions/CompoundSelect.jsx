import React from 'react';
import PropTypes from 'prop-types';
import QASelect from './qaSelect';

class QuestionCompoundSelect extends React.PureComponent {
  render() {
    const { questions, activeId, answers, handleAnswerSelect } = this.props;

    return (
      <div className="qa-compound-select">
        {questions.map(question => {
          const { id } = question;

          return (
            <QASelect
              key={id}
              ids={question.compoundQuestion}
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
  answers: PropTypes.object,
  activeId: PropTypes.string,
};

export default QuestionCompoundSelect;
