import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import isArray from 'lodash/isArray';
import { Subheader } from 'react-md';
import ColorTool from '../components/charts/colorMixingTool/index.jsx';
import ColorSwatch from '../components/charts/colorMixingTool/ColorSwatch.jsx';
import {
  getAnswerData,
  getObjectFromArrayGroup,
} from '../components/charts/colorMixingTool/color-tool.utilities.js';
import API from '../lib/API.js';

class AstroToolContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: null,
      options: null,
      answerData: null,
      selectorValue: '',
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
      const { name } = selectedData || {};

      const selectorValue = name || objectName || '';

      this.setState(prevState => ({
        ...prevState,
        jsonData,
        selectedData,
        selectorValue,
      }));
    });
  }

  selectionCallback = (d, val) => {
    const { widget } = this.props;
    const { options } = widget;
    const { questionId } = options || {};
    const { updateAnswer } = this.props;
    if (!d) return;

    if (questionId) {
      updateAnswer(questionId, d, 'change');
      this.setState(prevState => ({
        ...prevState,
        selectedData: d,
        selectorValue: val,
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
        leftIcon: <ColorSwatch color={hexColors[i]} />,
      };
    });
  }

  render() {
    const { widget, questionsByPage } = this.props;
    const { options } = widget || {};
    const {
      objectName,
      questionId,
      preSelected,
      hideControls,
      hideImage,
      hideSubHeadTitle,
      qaReview,
    } = options || {};
    const { jsonData, selectorValue, selectedData } = this.state;
    const { title, colorOptions, hexColors, data: dataObjects } =
      jsonData || {};

    const questionOnPage = !isEmpty(
      find(questionsByPage, {
        question: [{ id: questionId }],
      })
    );

    const toolIsInteractable = questionId ? questionOnPage : true;

    return (
      jsonData && (
        <ColorTool
          {...{
            title,
            colorOptions,
            hexColors,
            selectedData,
            selectorValue,
            objectName,
            toolIsInteractable,
            preSelected,
            hideControls,
            hideImage,
            hideSubHeadTitle,
            qaReview,
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
  questionsByPage: PropTypes.array,
};

export default AstroToolContainer;
