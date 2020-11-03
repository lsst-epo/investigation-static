import React from 'react';
import PropTypes from 'prop-types';
import PrismWidget from '../components/charts/prismWidget/index.jsx';

class PrismWidgetContainer extends React.PureComponent {
  getSelectedColor() {
    const { widget, answers } = this.props;
    const { options } = widget;
    const { questionId } = options || {};
    const answer = answers[questionId];

    return answer ? answer.data : 'None';
  }

  selectionCallback = value => {
    if (!value) return;
    const { widget, updateAnswer } = this.props;
    const { options } = widget;
    const { questionId } = options || {};

    if (questionId) {
      updateAnswer(questionId, value, 'change');
    }
  };

  render() {
    const { widget } = this.props;
    const {
      options: { questionId },
    } = widget || {};

    return (
      <PrismWidget
        selectedColor={this.getSelectedColor()}
        hasQuestionId={questionId !== null}
        selectionCallback={this.selectionCallback}
      />
    );
  }
}

PrismWidgetContainer.propTypes = {
  widget: PropTypes.object,
  answers: PropTypes.object,
  updateAnswer: PropTypes.func,
};

export default PrismWidgetContainer;
