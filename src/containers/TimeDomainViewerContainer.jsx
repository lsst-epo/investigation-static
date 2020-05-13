import React from 'react';
import PropTypes from 'prop-types';
import API from '../lib/API.js';
import TimeDomainViewer from '../components/charts/timeDomainViewer/index.jsx';

class TimeDomainViewerContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      alerts: null,
      images: null,
      activeAlert: null,
      activeImageIndex: 0,
      activeImageId: null,
      name: null,
      xDomain: null,
      yDomain: null,
    };
  }

  componentDidMount() {
    const {
      widget: { source },
    } = this.props;

    API.get(source).then(response => {
      const { data } = response;
      const { alerts, RA, Dec, name } = data;
      const activeAlert = alerts[0];
      const images = alerts.map(alert => {
        const { id } = alert;
        return { id, name: `/images/neos/${id}.jpg` };
      });

      this.setState(prevState => ({
        ...prevState,
        data,
        alerts,
        images,
        activeAlert,
        activeImageIndex: 0,
        activeImageId: activeAlert.id,
        name,
        xDomain: RA.reverse(),
        yDomain: Dec,
      }));
    });
  }

  selectionCallback = () => {
    const { data } = this.state;
    const {
      activeQuestionId,
      updateAnswer,
      options: { toggleDataPointsVisibility },
    } = this.props;
    const qId = toggleDataPointsVisibility || activeQuestionId;
    const answerData = this.getSelectionAnswerData();

    if (!answerData) updateAnswer(qId, data);
  };

  onBlinkChange = update => {
    this.setState(prevState => ({
      ...prevState,
      ...update,
    }));
  };

  getSelectionAnswerData() {
    const { options, answers, activeQuestionId } = this.props;
    const { toggleDataPointsVisibility } = options || {};
    const qId = toggleDataPointsVisibility || activeQuestionId;
    const answer = answers[qId];

    return answer ? answer.data : null;
  }

  getSelectionAnswerDataAlerts() {
    const answerData = this.getSelectionAnswerData();
    return answerData ? answerData.alerts : null;
  }

  render() {
    const { options } = this.props;
    const { preSelected } = options || {};
    const {
      alerts,
      images,
      activeAlert,
      activeImageIndex,
      activeImageId,
      xDomain,
      yDomain,
      name,
    } = this.state;

    return (
      <>
        {alerts && images && (
          <TimeDomainViewer
            name={name}
            {...{
              ...options,
              name,
              xDomain,
              yDomain,
              activeAlert,
              activeImageIndex,
              activeImageId,
              images,
            }}
            xValueAccessor="RA"
            yValueAccessor="Dec"
            data={alerts}
            selectedData={
              preSelected ? alerts : this.getSelectionAnswerDataAlerts()
            }
            blinkCallback={this.onBlinkChange}
            selectionCallback={this.selectionCallback}
          />
        )}
      </>
    );
  }
}

TimeDomainViewerContainer.propTypes = {
  widget: PropTypes.object,
  options: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  updateAnswer: PropTypes.func,
};

export default TimeDomainViewerContainer;
