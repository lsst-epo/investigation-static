import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import API from '../lib/API.js';
import ScatterPlotSelectorContainer from './ScatterPlotSelectorContainer';
import GalaxySelector from '../components/charts/galaxySelector';
import Legend from '../components/charts/galaxySelector/legend/index.jsx';
import Navigation from '../components/charts/galaxySelector/Nav.jsx';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import StarAvatar from '../components/charts/shared/navDrawer/StarAvatar.jsx';
import HubblePlot from '../components/charts/hubblePlot/index.jsx';
import {
  getSelectedData,
  getActiveImageIndex,
  getAlertImages,
  getGalaxyPointData,
} from '../components/charts/galaxySelector/galaxySelectorUtilities.js';
import { getHubblePlotData } from '../components/charts/hubblePlot/hubblePlotUtilities.js';

import chartColors from '../assets/stylesheets/_variables.scss';
import styles from '../components/charts/galaxySelector/galaxy-selector.module.scss';

class GalaxySelectorContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      plottedData: null,
      selectedData: null,
      plotIsOpen: false,
      activeGalaxy: null,
      activeGalaxyPointData: null,
      activeAlert: null,
      activeImageIndex: 0,
      activeImageId: null,
      openMenu: false,
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

      const { options, answers } = this.props;

      const { alerts } = data[0];

      this.setState(prevState => ({
        ...prevState,
        activeAlert: alerts[0],
        activeGalaxy: data[0],
        activeGalaxyPointData: getGalaxyPointData(data[0]),
        data,
        plottedData: getHubblePlotData(data, options, answers),
      }));
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { options, answers } = this.props;
    const {
      createUserHubblePlot: hubbleQId,
      toggleDataPointsVisibility: selectorQId,
    } = options || {};
    const answer = answers[hubbleQId];
    const answerSelected = answers[selectorQId];
    const { data, activeGalaxy } = this.state;
    const { answers: prevAnswers } = prevProps;
    const answerPrev = prevAnswers[hubbleQId];
    const answerPrevSelected = prevAnswers[selectorQId];
    const { data: prevData, activeGalaxy: prevActiveGalaxy } = prevState;

    if (data !== prevData || answer !== answerPrev) {
      this.updateHubblePlotData(data, options, answers);
    }

    if (
      activeGalaxy !== prevActiveGalaxy ||
      answerSelected !== answerPrevSelected
    ) {
      this.updateSelectedData(activeGalaxy, answers, selectorQId);
    }
  }

  updateHubblePlotData(data, options, answers) {
    this.setState(prevState => ({
      ...prevState,
      plottedData: getHubblePlotData(data, options, answers),
    }));
  }

  updateSelectedData(activeGalaxy, answers, qId) {
    this.setState(prevState => ({
      ...prevState,
      selectedData: getSelectedData(activeGalaxy, answers, qId),
    }));
  }

  chooseGalaxyAndClosePlot(event, activeGalaxy) {
    if (event) {
      const { answers, options } = this.props;
      const { toggleDataPointsVisibility: qId } = options || {};
      const { alerts } = activeGalaxy;
      const activeAlert = alerts[0];

      this.setState(prevState => ({
        ...prevState,
        activeGalaxy,
        activeGalaxyPointData: getGalaxyPointData(activeGalaxy),
        selectedData: getSelectedData(activeGalaxy, answers, qId),
        activeImageIndex: 0,
        activeImageId: activeAlert.image_id,
        activeAlert: alerts[0],
        plotIsOpen: false,
      }));
    }
  }

  handleSlideOutPlot = () => {
    this.setState(prevState => ({
      ...prevState,
      plotIsOpen: !prevState.plotIsOpen,
    }));
  };

  closeScatterPlot = () => {
    this.setState(prevState => ({
      ...prevState,
      plotIsOpen: false,
    }));
  };

  gotToPrevGalaxy = () => {
    this.goToGalaxy(-1);
  };

  goToNextGalaxy = () => {
    this.goToGalaxy(1);
  };

  goToGalaxy(direction) {
    const {
      activeGalaxy: oldActiveGalaxy,
      data,
      plotIsOpen,
      selectedData,
    } = this.state;
    const { answers, options } = this.props;
    const { toggleDataPointsVisibility: qId } = options || {};
    const lastIndex = data.length - 1;
    const oldIndex = data.indexOf(oldActiveGalaxy);
    const index = oldIndex + direction;
    let activeGalaxy = oldActiveGalaxy;

    if (index < 0) {
      activeGalaxy = data[lastIndex];
    } else if (index > lastIndex) {
      activeGalaxy = data[0];
    } else {
      activeGalaxy = data[index];
    }

    const galSnSelected = selectedData.length >= 2;

    if (plotIsOpen && !galSnSelected) this.handleSlideOutPlot();

    const { alerts } = activeGalaxy;
    const activeAlert = alerts[0];

    this.setState(prevState => ({
      ...prevState,
      activeGalaxy,
      activeGalaxyPointData: getGalaxyPointData(activeGalaxy),
      selectedData: getSelectedData(activeGalaxy, answers, qId),
      activeImageIndex: 0,
      activeImageId: activeAlert.image_id,
      activeAlert,
    }));
  }

  generateNavItems(navItems) {
    const { activeGalaxy } = this.state;
    const {
      answers,
      options: { toggleDataPointsVisibility: qId },
    } = this.props;
    const answer = answers[qId];
    const answerData = !isEmpty(answer) ? answer.data : {};

    return navItems.map((item, i) => {
      const { name } = item;
      const itemAnswerData = answerData[name];

      const active = name === activeGalaxy.name;
      const complete = itemAnswerData ? itemAnswerData.length === 2 : false;
      const disabled = false;

      return {
        leftAvatar: (
          <StarAvatar classes={`color-${i + 1}-fill`} content={name} />
        ),
        primaryText: name,
        className: classnames(styles.galaxyItem, {
          [styles.linkActive]: active,
          [styles.linkIsComplete]: complete,
          [styles.linkIsNotComplete]: !complete,
          [styles.linkIsDisabled]: disabled,
        }),
        disabled,
        active,
        onClick: e => this.chooseGalaxyAndClosePlot(e, item),
      };
    });
  }

  getToolbarStyles(activeGalaxy, data) {
    const colorIndex = activeGalaxy ? data.indexOf(activeGalaxy) + 1 : null;
    return colorIndex
      ? { backgroundColor: chartColors[`chart${colorIndex}`] }
      : null;
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
      const dObj = { [activeGalaxy.name]: d };
      const answer = answers[qId];
      const answerObj = !isEmpty(answer) ? { ...answer.data, ...dObj } : dObj;

      updateAnswer(qId, answerObj, 'change');
    }

    if (d.length > 1) {
      this.handleSlideOutPlot();
    }
  };

  onBlinkChange = update => {
    this.setState(prevState => ({
      ...prevState,
      ...update,
    }));
  };

  userHubblePlotCallback = (qId, plottedData) => {
    const { updateAnswer } = this.props;

    updateAnswer(qId, plottedData, 'change');

    this.setState(prevState => ({
      ...prevState,
      plottedData,
    }));
  };

  render() {
    const {
      activeAlert,
      activeImageId,
      activeImageIndex,
      data,
      plotIsOpen,
      activeGalaxy,
      activeGalaxyPointData,
      plottedData,
      selectedData,
    } = this.state;

    const { options } = this.props;
    const { image, autoplay } = options || {};

    return (
      <>
        <h2 className="space-bottom heading-primary">Galaxy Selector</h2>
        {data && (
          <NavDrawer
            interactableToolbar
            classes={styles.galaxyNavDrawer}
            cardClasses={styles.container}
            contentClasses={styles.galaxyDrawerContent}
            drawerClasses={styles.galaxyDrawer}
            navItems={this.generateNavItems(data)}
            toolbarStyles={this.getToolbarStyles(activeGalaxy, data)}
            toolbarTitle={activeGalaxy ? activeGalaxy.name : 'Galaxy Selector'}
            toolbarActions={<Legend {...{ activeGalaxy, selectedData }} />}
            menuOpenCallback={this.closeScatterPlot}
          >
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
                activeImageId={
                  activeAlert ? activeAlert.image_id : activeImageId
                }
                activeImageIndex={getActiveImageIndex(
                  activeGalaxy,
                  activeAlert,
                  activeImageIndex
                )}
              />
            </div>
            <ScatterPlotSelectorContainer
              opened={plotIsOpen || false}
              onSlideOutClick={this.handleSlideOutPlot}
            >
              <HubblePlot
                className="hubble-plot"
                {...{
                  options,
                  activeGalaxy,
                }}
                data={plottedData}
                userHubblePlotCallback={this.userHubblePlotCallback}
              />
              <Navigation
                handlePrevGalaxy={this.gotToPrevGalaxy}
                handleNextGalaxy={this.goToNextGalaxy}
              />
            </ScatterPlotSelectorContainer>
          </NavDrawer>
        )}
      </>
    );
  }
}

GalaxySelectorContainer.propTypes = {
  widget: PropTypes.object,
  options: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  updateAnswer: PropTypes.func,
};

export default GalaxySelectorContainer;
