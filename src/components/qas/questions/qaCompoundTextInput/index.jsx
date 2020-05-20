import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '../../../site/card';
import QATextInput from '../qaTextInput';
import styles from '../../styles.module.scss';

class QACompoundTextInput extends React.PureComponent {
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
    const cardClasses = classnames(styles.qaCard, {
      [styles.active]: hasFocus,
    });

    return (
      <Card className={cardClasses}>
        <div className="qa-wrapper">
          {questions.map(question => {
            const { id, questionType } = question;

            return (
              <QATextInput
                key={id}
                ids={question.compoundQuestion}
                answer={answers[id]}
                focusCallback={this.updateActive}
                answerHandler={handleAnswerSelect}
                {...{
                  question,
                  activeId,
                  questionType,
                }}
              />
            );
          })}
        </div>
      </Card>
    );
  }
}

QACompoundTextInput.propTypes = {
  handleAnswerSelect: PropTypes.func,
  questions: PropTypes.array,
  answers: PropTypes.object,
  activeId: PropTypes.string,
};

export default QACompoundTextInput;
