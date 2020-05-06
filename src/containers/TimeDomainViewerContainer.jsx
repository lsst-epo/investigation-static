import React from 'react';
import PropTypes from 'prop-types';
import API from '../lib/API.js';
import TimeDomainViewer from '../components/charts/timeDomainViewer/index.jsx';

class TimeDomainViewerContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
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

  selectionCallback = d => {
    console.log(d);
  };

  onBlinkChange = update => {
    this.setState(prevState => ({
      ...prevState,
      ...update,
    }));
  };

  render() {
    const { options } = this.props;
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
            selectedData={alerts}
            blinkCallback={this.onBlinkChange}
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
