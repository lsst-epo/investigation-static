import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '../../../site/card';
import QASelect from '../qaSelect';
import { qaCard, active } from '../../styles.module.scss';

class QACompoundSelect extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hasFocus: false,
    };
  }

  updateActive = hasFocus => {
    this.setState(prevState => ({
      ...prevState,
      hasFocus,
    }));
  };

  render() {
    const { questions, activeId, answers, handleAnswerSelect } = this.props;
    const { hasFocus } = this.state;
    const cardClasses = classnames(qaCard, { [active]: hasFocus });

    return (
      <Card className={cardClasses}>
        <div className="qa-wrapper">
          {questions.map(question => {
            const { id, questionType } = question;

            return (
              <QASelect
                key={id}
                ids={question.compoundQuestion}
                question={question}
                answer={answers[id]}
                handleAnswerSelect={handleAnswerSelect}
                focusCallback={this.updateActive}
                activeId={activeId}
                questionType={questionType}
              />
            );
          })}
        </div>
      </Card>
    );
  }
}

QACompoundSelect.propTypes = {
  handleAnswerSelect: PropTypes.func,
  questions: PropTypes.array,
  answers: PropTypes.object,
  activeId: PropTypes.string,
};

export default QACompoundSelect;
