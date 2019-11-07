import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { checkIds } from '../../../../lib/utilities.js';
import Card from '../../../site/card';
import QASelect from '../qaSelect';
import styles from './styles.module.scss';

class QACompoundSelect extends React.PureComponent {
  render() {
    const { questions, activeId, answers, handleAnswerSelect } = this.props;
    const active = checkIds(questions[0].compoundQuestion, activeId);
    const cardClasses = classnames('qa-card', { active });

    return (
      <Card className={cardClasses}>
        <div className={styles.qaWrapper}>
          {questions.map(question => {
            const { id, questionType } = question;

            return (
              <QASelect
                key={id}
                ids={question.compoundQuestion}
                question={question}
                answer={answers[id]}
                handleAnswerSelect={handleAnswerSelect}
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
