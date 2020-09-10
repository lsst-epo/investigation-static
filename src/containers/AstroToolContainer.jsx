import React from 'react';
import PropTypes from 'prop-types';
import ColorTool from '../components/charts/colorMixingTool/index.jsx';
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
    const { questionId } = options || {};
    const { answers } = this.props;
    const answer = answers[questionId];
    const galaxies = answer ? Object.keys(answer.data) : [];
    const galaxy = this.findActiveGalaxy(galaxies, answer);
    API.get(source).then(response => {
      const { data } = response;

      this.setState(prevState => ({
        ...prevState,
        jsonData: data,
        answerData: answer ? answer.data : data.data,
        selectorVal: galaxy,
      }));
    });
  }

  findActiveGalaxy(galaxies, answer) {
    for (let i = 0; i < galaxies.length; i += 1) {
      const galaxyName = galaxies[i];
      const filter = answer.data[galaxyName];
      if (filter.active) {
        return galaxyName;
      }
    }
    return '';
  }

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
    const { widget } = this.props;
    const { options } = widget;
    const { jsonData, selectorVal, answerData } = this.state;
    const { title, colorOptions, hexColors } = jsonData || {};
    const { galaxyImg } = options || {};

    return (
      jsonData && (
        <ColorTool
          {...{
            title,
            colorOptions,
            hexColors,
            galaxyImg,
            selectorVal,
          }}
          data={answerData}
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
