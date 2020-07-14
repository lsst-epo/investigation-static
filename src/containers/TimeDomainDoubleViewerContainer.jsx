import React from 'react';
import PropTypes from 'prop-types';
import TimeDomainViewerContainer from './TimeDomainViewerContainer.jsx';
import chartColors from '../assets/stylesheets/_variables.scss';

class TimeDomainDoubleViewerContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      widgets: null,
    };
  }

  componentDidMount() {
    const { widget } = this.props;
    const { sources } = widget || {};

    if (sources) {
      this.setState(prevState => ({
        ...prevState,
        widgets: sources.map(source => {
          return { ...widget, type: 'TimeDomainViewer', sources: null, source };
        }),
      }));
    }
  }

  render() {
    const { options, answers, activeQuestionId, updateAnswer } = this.props;
    const { widgets } = this.state;

    return (
      <div className="container-flex spaced centered">
        {widgets &&
          widgets.map((w, i) => {
            return (
              <div className="col-width-50 padded" key={w.source}>
                <TimeDomainViewerContainer
                  widget={w}
                  color={chartColors[`chart${i + 1}`]}
                  {...{ options, answers, activeQuestionId, updateAnswer }}
                />
              </div>
            );
          })}
      </div>
    );
  }
}

TimeDomainDoubleViewerContainer.propTypes = {
  widget: PropTypes.object,
  options: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  updateAnswer: PropTypes.func,
};

export default TimeDomainDoubleViewerContainer;
