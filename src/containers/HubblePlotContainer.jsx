import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import API from '../lib/API.js';
import HubblePlot from '../components/charts/hubblePlot/index.jsx';
import { getHubblePlotData } from '../components/charts/hubblePlot/hubblePlotUtilities.js';

class HubblePlotContainer extends React.PureComponent {
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

      this.setState(prevState => ({
        ...prevState,
        data,
      }));
    });
  }

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

  getHubbleConstant(qId, hubbleConstant) {
    if (hubbleConstant) return parseFloat(hubbleConstant);

    const { answers } = this.props;
    const answer = answers[qId];

    if (!isEmpty(answer)) {
      return parseFloat(answer.data);
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
        <HubblePlot
          className="hubble-plot"
          {...{
            data,
            options,
            trendlineInteractable,
          }}
          hubbleConstant={this.getHubbleConstant(userTrendline, hubbleConstant)}
          userHubblePlotCallback={this.userHubblePlotCallback}
          userTrendlineCallback={this.userTrendlineCallback}
        />
      </>
    );
  }
}

HubblePlotContainer.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  widget: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  activeAnswer: PropTypes.object,
  updateAnswer: PropTypes.func,
};

export default HubblePlotContainer;
