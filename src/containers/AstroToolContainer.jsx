import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import { Subheader } from 'react-md';
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

      const selectorVal = name || objectName || '';

      this.setState(prevState => ({
        ...prevState,
        jsonData,
        selectedData,
        selectorVal,
      }));
    });
  }

  componentDidUpdate() {
    const { widget, answers, activeQuestionId } = this.props;
    const { options } = widget;
    const { questionId } = options || {};
    const answer = answers[activeQuestionId || questionId];

    if (isEmpty(answer) && questionId) {
      this.updateAnswer();
    }
  }

  updateAnswer = () => {
    const { widget } = this.props;
    const { options } = widget;
    const { objectName } = options || {};
    const {
      jsonData,
      selectedData: oldSelectedData,
      selectorVal: oldSelectorVal,
    } = this.state;

    if (jsonData) {
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
          const { updateAnswer, widget: w } = this.props;
          const { options: opt } = w || {};
          const { questionId } = opt || {};
          const { selectedData: newData } = this.state;
          updateAnswer(questionId, newData);
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

  getMenuItems = () => {
    const { jsonData } = this.state;
    const { data } = jsonData || {};

    if (!isArray(data)) return [];

    const items = [];

    data.forEach(category => {
      items.push(<Subheader key={category.type} primaryText={category.type} />);
      category.objects.forEach(object => {
        items.push({
          label: `${category.type}: ${object.name}`,
          value: object.name,
        });
      });
    });

    return items;
  };

  getColorBlocks() {
    const { jsonData } = this.state;
    const { colorOptions, hexColors } = jsonData || {};
    return colorOptions.map((color, i) => {
      return {
        label: color,
        value: hexColors[i] || color,
      };
    });
  }

  render() {
    const { widget, activeQuestionId } = this.props;
    const {
      options: { objectName, questionId },
    } = widget || {};
    const { jsonData, selectorVal, selectedData } = this.state;
    const { title, colorOptions, hexColors, data: dataObjects } =
      jsonData || {};

    const toolIsInteractable = questionId
      ? activeQuestionId !== null && questionId === activeQuestionId
      : true;

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
            toolIsInteractable,
          }}
          menuItems={this.getMenuItems()}
          colorBlocks={this.getColorBlocks()}
          hasQuestionId={questionId !== null}
          data={dataObjects}
          selectionCallback={this.selectionCallback}
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
