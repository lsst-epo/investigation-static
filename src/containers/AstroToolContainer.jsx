import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import ColorTool from '../components/charts/colorMixingTool/index.jsx';
import {
  findObjectFromAnswer,
  getAnswerData,
  getObjectFromArrayGroup,
  resetAllFilters,
} from '../components/charts/colorMixingTool/color-tool.utilities.js';
import API from '../lib/API.js';

class AstroToolContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: null,
      options: null,
      answerData: null,
      selectorVal: '',
    };
  }

  componentDidMount() {
    const { widget } = this.props;
    const { source, options } = widget;
    const { objectName, questionId } = options || {};
    const { answers } = this.props;
    const answer = answers[questionId];

    API.get(source).then(response => {
      const { data: jsonData } = response;

      const selectedData =
        getAnswerData(answer) ||
        getObjectFromArrayGroup(jsonData.data, objectName) ||
        {};

      const selectedObject = findObjectFromAnswer(answer) || selectedData;
      const { name } = selectedObject || {};

      this.setState(prevState => ({
        ...prevState,
        jsonData,
        selectedData,
        selectorVal: name || '',
      }));
    });
  }

  componentDidUpdate() {
    this.checkAnswer();
  }

  checkAnswer = () => {
    const { widget, answers, activeQuestionId } = this.props;
    const { options } = widget;
    const { objectName, questionId } = options || {};
    const {
      jsonData,
      selectedData: oldSelectedData,
      selectorVal: oldSelectorVal,
    } = this.state;
    const answer = answers[activeQuestionId || questionId];

    if (jsonData && questionId && isEmpty(answer)) {
      const selectorVal = objectName || oldSelectorVal;
      const selectedData =
        oldSelectedData || getObjectFromArrayGroup(jsonData.data, selectorVal);
      const newSelectedData = {
        name: selectorVal,
        filters: resetAllFilters(selectedData),
      };

      this.setState(
        prevState => ({
          ...prevState,
          selectedData: newSelectedData,
          selectorVal,
        }),
        () => {
          const { selectedData: newData, selectorVal: newVal } = this.state;
          this.selectionCallback(newData, newVal);
        }
      );
    }
  };

  selectionCallback = (d, val) => {
    const { widget } = this.props;
    const { options } = widget;
    const { questionId } = options || {};
    const { updateAnswer } = this.props;
    if (!d) return;

    if (questionId) {
      updateAnswer(questionId, d);
      this.setState(prevState => ({
        ...prevState,
        selectedData: d,
        selectorVal: val,
      }));
    }
  };

  render() {
    const { widget, activeQuestionId } = this.props;
    const {
      options: { objectName, questionId },
    } = widget || {};
    const { jsonData, selectorVal, selectedData } = this.state;
    const { title, colorOptions, hexColors, data: dataObjects } =
      jsonData || {};

    return (
      jsonData && (
        <ColorTool
          {...{
            title,
            colorOptions,
            hexColors,
            selectedData,
            selectorVal,
            objectName,
          }}
          hasQuestionId={questionId !== null}
          data={dataObjects}
          selectionCallback={this.selectionCallback}
          toolIsInteractable={activeQuestionId !== null}
        />
      )
    );
  }
}

AstroToolContainer.propTypes = {
  widget: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  updateAnswer: PropTypes.func,
};

export default AstroToolContainer;
