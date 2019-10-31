import React from 'react';
import PropTypes from 'prop-types';
import QASelect from './QASelect';

class QACompoundSelect extends React.PureComponent {
  render() {
    const { question, activeId, answer, handleAnswerSelect } = this.props;
    const { id, ids } = question;

    return (
      <div className="qa-compound-select">
        <QASelect
          key={id}
          ids={ids}
          question={question}
          answer={answer}
          handleAnswerSelect={handleAnswerSelect}
          activeId={activeId}
        />
      </div>
    );
  }
}

QACompoundSelect.propTypes = {
  handleAnswerSelect: PropTypes.func,
  question: PropTypes.object,
  answer: PropTypes.object,
  activeId: PropTypes.string,
};

export default QACompoundSelect;
