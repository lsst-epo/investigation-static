import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import API from '../lib/API.js';
import TimeDomainViewer from '../components/charts/timeDomainViewer/index.jsx';
import chartColors from '../assets/stylesheets/_variables.scss';

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
      widget: { source, sources },
    } = this.props;

    if (sources && !source) {
      axios.all(this.allGets(sources)).then(
        axios.spread((...responses) => {
          const data = responses.map(reponse => {
            const { data: rData } = reponse;
            return rData;
          });

          this.setState(prevState => ({
            ...prevState,
            data: data.map(d => d.data),
            group: data.map(d => d.group),
            twoUp: true,
          }));
        })
      );
    } else if (source && !sources) {
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
  }

  allGets(sources) {
    return sources.map(source => {
      return API.get(source);
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

    if (!answerData) updateAnswer(qId, data, 'change');
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
    const { options, color } = this.props;
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
              color,
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

TimeDomainViewerContainer.defaultProps = {
  color: chartColors.chart1,
};

TimeDomainViewerContainer.propTypes = {
  widget: PropTypes.object,
  options: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  updateAnswer: PropTypes.func,
  color: PropTypes.string,
};

export default TimeDomainViewerContainer;
