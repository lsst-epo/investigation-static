import React from 'reactn';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';

export const WithQuestions = ComposedComponent => {
  class WrappedComponent extends React.PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        questions: null,
        activeId: null,
      };
    }

    componentDidMount() {
      const { questionsRange } = this.props;

      this.setQuestions(this.getQuestions(questionsRange));
      this.setActiveQuestion(this.getActiveId(questionsRange));
    }

    getQuestions = questionsRange => {
      const { questions } = this.global;

      if (!isEmpty(questions)) {
        return filter(
          questionsRange.map(questionId => {
            return questions[questionId.toString()];
          }),
          q => {
            return !!q;
          }
        );
      }

      return null;
    };

    setQuestions = questions => {
      this.setState(prevState => ({
        ...prevState,
        questions,
      }));
    };

    getActiveId = questionsRange => {
      const { answers } = this.global;
      let activeId = null;
      let i = 0;

      while (i < questionsRange.length) {
        const id = questionsRange[i];

        if (isEmpty(answers[id])) {
          activeId = id.toString();
          i = questionsRange.length;
        }

        i += 1;
      }

      return activeId;
    };

    setActiveQuestion = id => {
      this.setState(prevState => ({
        ...prevState,
        activeId: id,
      }));
    };

    advanceActiveQuestion = () => {
      const { questionsRange } = this.props;

      this.setActiveQuestion(this.getActiveId(questionsRange));
    };

    render() {
      const { questions, activeId: activeIdState } = this.state;
      const { activeId: activeIdProp } = this.props;

      return (
        <ComposedComponent
          {...this.props}
          questions={questions}
          activeId={activeIdProp || activeIdState}
          getActive={this.getActiveId}
          setActive={this.setActiveQuestion}
          advanceActive={this.advanceActiveQuestion}
        />
      );
    }
  }

  WrappedComponent.propTypes = {
    activeId: PropTypes.number,
    questionsRange: PropTypes.array,
  };

  return WrappedComponent;
};

export default WithQuestions;
