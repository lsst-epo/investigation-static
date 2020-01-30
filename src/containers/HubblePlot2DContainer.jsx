import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import API from '../lib/API.js';
import HubblePlot2D from '../components/charts/hubblePlot/HubblePlot2D.jsx';
import { getHubblePlotData } from '../components/charts/hubblePlot/hubblePlotUtilities.js';

class HubblePlot2DContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    const {
      widget: { source },
      options,
      answers,
    } = this.props;

    API.get(source).then(response => {
      const responseData = isArray(response.data) ? response.data : [];

      const data = getHubblePlotData(responseData, options, answers);
      // console.log(data);
      this.setState(prevState => ({
        ...prevState,
        data,
      }));
    });
  }

  hubbleSelectionCallback = d => {
    console.log(d); // eslint-disable-line no-console
    // const { activeQuestionId } = this.props;
    // if (activeQuestionId) {
    //   updateAnswer(activeQuestionId, activeSupernova);
    // }
  };

  userHubblePlotCallback = (qId, data) => {
    const { updateAnswer, activeQuestionId } = this.props;

    updateAnswer(qId || activeQuestionId, data);

    this.setState(prevState => ({
      ...prevState,
      data,
    }));
  };

  userTrendlineCallback = (qId, data) => {
    const { updateAnswer, activeQuestionId } = this.props;

    updateAnswer(qId || activeQuestionId, data);
  };

  getHubbleConstant(qId) {
    const { answers } = this.props;
    const answer = answers[qId];

    if (!isEmpty(answer)) {
      return answer.data;
    }

    return null;
  }

  render() {
    const { data } = this.state;
    const {
      activeQuestionId,
      options,
      options: { userTrendline, hubbleConstant },
    } = this.props;

    const trendlineInteractable = userTrendline === activeQuestionId;

    return (
      <>
        <h2 className="space-bottom">Hubble Plot</h2>
        <HubblePlot2D
          className="hubble-plot"
          {...{
            data,
            options,
            trendlineInteractable,
          }}
          hubbleConstant={parseFloat(
            hubbleConstant || this.getHubbleConstant(userTrendline)
          )}
          selectionCallback={this.hubbleSelectionCallback}
          userHubblePlotCallback={this.userHubblePlotCallback}
          userTrendlineCallback={this.userTrendlineCallback}
        />
      </>
    );
  }
}

HubblePlot2DContainer.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  widget: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  activeAnswer: PropTypes.object,
  updateAnswer: PropTypes.func,
};

export default HubblePlot2DContainer;
