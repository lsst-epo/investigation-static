import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '../../../site/card';
import QASelect from '../qaSelect';
import QATextInput from '../qaTextInput';
import { qaCard, active } from '../../styles.module.scss';

class QACompound extends React.PureComponent {
  constructor(props) {
    super(props);

    this.qaTypes = {
      compoundInput: QATextInput,
      compoundSelect: QASelect,
    };

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
            const { id, questionType, options } = question;
            const QACompoundComponent = this.qaTypes[questionType];
            if (!QACompoundComponent) return null;

            return (
              <QACompoundComponent
                key={id}
                ids={question.compoundQuestion}
                answer={answers[id]}
                focusCallback={this.updateActive}
                answerHandler={handleAnswerSelect}
                handleAnswerSelect={handleAnswerSelect}
                {...{
                  question,
                  activeId,
                  questionType,
                  options,
                }}
              />
            );
          })}
        </div>
      </Card>
    );
  }
}

QACompound.propTypes = {
  handleAnswerSelect: PropTypes.func,
  questions: PropTypes.array,
  answers: PropTypes.object,
  activeId: PropTypes.string,
};

export default QACompound;
