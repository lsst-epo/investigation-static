import React from 'react';
import PropTypes from 'prop-types';
import PrismWidget from '../components/charts/prismWidget/index.jsx';

class PrismWidgetContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedColor: null,
    };
  }

  componentDidMount() {
    const { widget } = this.props;
    const { options } = widget;
    const { questionId } = options || {};
    const { answers } = this.props;
    const answer = answers[questionId];
    const { data: answerData } = answer || {};

    this.setState(prevState => ({
      ...prevState,
      selectedColor: answerData || 'None',
    }));
  }

  selectionCallback = value => {
    const { widget } = this.props;
    const { options } = widget;
    const { questionId } = options || {};
    const { updateAnswer } = this.props;
    if (!value) return;

    if (questionId) {
      updateAnswer(questionId, value);
      this.setState(prevState => ({
        ...prevState,
        selectedColor: value,
      }));
    }
  };

  render() {
    const { selectedColor } = this.state;
    const { widget } = this.props;
    const {
      options: { questionId },
    } = widget || {};

    return (
      selectedColor && (
        <PrismWidget
          selectedColor={selectedColor}
          hasQuestionId={questionId !== null}
          selectionCallback={this.selectionCallback}
        />
      )
    );
  }
}

PrismWidgetContainer.propTypes = {
  widget: PropTypes.object,
  answers: PropTypes.object,
  updateAnswer: PropTypes.func,
};

export default PrismWidgetContainer;
