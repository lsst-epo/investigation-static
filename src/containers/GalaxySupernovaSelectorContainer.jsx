import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import API from '../lib/API.js';
import GalaxySelector from '../components/charts/galaxySelector';
import {
  getSelectedData,
  getActiveImageIndex,
  getAlertImages,
  getGalaxyPointData,
} from '../components/charts/galaxySelector/galaxySelectorUtilities.js';

class GalaxySupernovaSelectorContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      selectedData: null,
      activeGalaxy: null,
      activeGalaxyPointData: null,
      activeAlert: null,
      activeImageIndex: 0,
      activeImageId: null,
    };
  }

  componentDidMount() {
    const {
      widget: { source },
    } = this.props;

    API.get(source).then(response => {
      const data = response.data.map(galaxy => {
        galaxy.images = getAlertImages(galaxy.id || galaxy.name, galaxy.alerts);
        return galaxy;
      });

      const { options } = this.props;
      const { preSelectedId } = options || {};

      const selectedGalaxy = filter(data, { id: preSelectedId })[0] || {};

      const { alerts } = selectedGalaxy;

      this.setState(prevState => ({
        ...prevState,
        activeAlert: alerts[0],
        activeGalaxy: selectedGalaxy,
        activeGalaxyPointData: getGalaxyPointData(selectedGalaxy),
        data,
      }));
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { options, answers } = this.props;
    const { toggleDataPointsVisibility: selectorQId } = options || {};
    const answerSelected = answers[selectorQId];
    const { activeGalaxy } = this.state;
    const { answers: prevAnswers } = prevProps;
    const answerPrevSelected = prevAnswers[selectorQId];
    const { activeGalaxy: prevActiveGalaxy } = prevState;

    if (
      activeGalaxy !== prevActiveGalaxy ||
      answerSelected !== answerPrevSelected
    ) {
      this.updateSelectedData(activeGalaxy, answers, selectorQId);
    }
  }

  updateSelectedData(activeGalaxy, answers, qId) {
    this.setState(prevState => ({
      ...prevState,
      selectedData: getSelectedData(activeGalaxy, answers, qId),
    }));
  }

  selectionCallback = d => {
    if (!d) return;

    const {
      answers,
      updateAnswer,
      activeQuestionId,
      options: { toggleDataPointsVisibility },
    } = this.props;
    const { activeGalaxy } = this.state;
    const qId = toggleDataPointsVisibility || activeQuestionId;

    if (qId) {
      const { name, distance, velocity } = activeGalaxy;
      const dObj = {
        distance: filter(d, { id: 'supernova' }).length > 0 ? distance : null,
        velocity: filter(d, { id: 'galaxy' }).length > 0 ? velocity : null,
        [name]: d,
      };
      const answer = answers[qId];
      const answerObj = !isEmpty(answer) ? { ...answer.data, ...dObj } : dObj;

      updateAnswer(qId, answerObj, 'change');
    }
  };

  onBlinkChange = update => {
    this.setState(prevState => ({
      ...prevState,
      ...update,
    }));
  };

  render() {
    const {
      activeAlert,
      activeImageId,
      activeImageIndex,
      data,
      activeGalaxy,
      activeGalaxyPointData,
      selectedData,
    } = this.state;

    const { options } = this.props;
    const { image, autoplay } = options || {};

    return (
      <>
        <h2 className="space-bottom heading-primary">
          Galaxy & Supernova Selector
        </h2>
        {data && (
          <div className="galaxy-selector-images--container">
            <GalaxySelector
              className={`galaxy-selector-${data.name}`}
              {...{ selectedData, activeGalaxy, autoplay }}
              data={activeGalaxyPointData}
              alerts={activeGalaxy ? activeGalaxy.alerts : []}
              image={image}
              images={activeGalaxy ? activeGalaxy.images : []}
              selectionCallback={this.selectionCallback}
              blinkCallback={this.onBlinkChange}
              activeImageId={activeAlert ? activeAlert.image_id : activeImageId}
              activeImageIndex={getActiveImageIndex(
                activeGalaxy,
                activeAlert,
                activeImageIndex
              )}
            />
          </div>
        )}
      </>
    );
  }
}

GalaxySupernovaSelectorContainer.propTypes = {
  widget: PropTypes.object,
  options: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  updateAnswer: PropTypes.func,
};

export default GalaxySupernovaSelectorContainer;
