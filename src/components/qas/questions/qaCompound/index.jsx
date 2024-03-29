import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '../../../site/card';
import QASelect from '../qaSelect';
import QATextInput from '../qaTextInput';
import { qaCard, active } from '../../styles.module.scss';
import QAFillableTable from '../qaFillableTable';

class QACompound extends React.PureComponent {
  constructor(props) {
    super(props);

    this.qaTypes = {
      compoundInput: QATextInput,
      compoundSelect: QASelect,
      fillableTable: QAFillableTable,
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

  map;

  render() {
    const {
      questionNumber,
      questions,
      activeId,
      answers,
      handleAnswerSelect,
      tables,
    } = this.props;
    const { hasFocus } = this.state;
    const cardClasses = classnames(qaCard, { [active]: hasFocus });

    if (tables) {
      return tables.map(table => {
        const { id } = table;

        return (
          <QAFillableTable
            key={id}
            focusCallback={this.updateActive}
            answerHandler={handleAnswerSelect}
            handleAnswerSelect={handleAnswerSelect}
            {...{
              questions,
              activeId,
              answers,
              questionNumber,
              table,
            }}
          />
        );
      });
    }

    return (
      <Card className={cardClasses}>
        <div className="qa-wrapper">
          {questions.map((question, i) => {
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
                firstQuestion={i === 0}
                {...{
                  question,
                  activeId,
                  questionNumber,
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
  questionNumber: PropTypes.number,
  questions: PropTypes.array,
  answers: PropTypes.object,
  activeId: PropTypes.string,
  tables: PropTypes.array,
};

export default QACompound;
