import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import API from '../lib/API.js';
import ScatterPlotSelectorContainer from './ScatterPlotSelectorContainer';
import GalaxySelector from '../components/charts/galaxySelector';
import Legend from '../components/charts/galaxySelector/legend/index.jsx';
import Star from '../components/site/icons/Star';
import Navigation from '../components/charts/galaxySelector/Nav.jsx';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import HubblePlot from '../components/charts/hubblePlot/index.jsx';
import {
  getSelectedData,
  getActiveImageIndex,
  getAlertImages,
  getGalaxyPointData,
} from '../components/charts/galaxySelector/galaxySelectorUtilities.js';
import { getHubblePlotData } from '../components/charts/hubblePlot/hubblePlotUtilities.js';

import styles from '../components/charts/galaxySelector/galaxy-selector.module.scss';

class GalaxySelectorContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      plottedData: null,
      plotIsOpen: false,
      activeGalaxy: null,
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
        data,
        plottedData: getHubblePlotData(data, options, answers),
      }));
    });
  }

  chooseGalaxyAndClosePlot(event, activeGalaxy) {
    if (event) {
      const { alerts } = activeGalaxy;
      const activeAlert = alerts[0];

      this.setState(prevState => ({
        ...prevState,
        activeGalaxy,
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
    const { activeGalaxy: oldActiveGalaxy, data, plotIsOpen } = this.state;
    const { answers, options } = this.props;
    const { toggleDataPointsVisibility } = options || {};
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

    const galSnSelected =
      (getSelectedData(activeGalaxy, answers, toggleDataPointsVisibility) || [])
        .length >= 2;

    if (plotIsOpen && !galSnSelected) this.handleSlideOutPlot();

    const { alerts } = activeGalaxy;
    const activeAlert = alerts[0];

    this.setState(prevState => ({
      ...prevState,
      activeGalaxy,
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

    return navItems.map(item => {
      const { name, color } = item;
      const itemAnswerData = answerData[name];

      const active = name === activeGalaxy.name;
      const complete = itemAnswerData ? itemAnswerData.length === 2 : false;
      const disabled = false;

      return {
        leftAvatar: (
          <span>
            <Star style={{ fill: color }} />
            <span className="screen-reader-only">{name}</span>
          </span>
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

      updateAnswer(qId, answerObj);
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

    updateAnswer(qId, plottedData);

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
      plottedData,
    } = this.state;

    const { answers, options } = this.props;
    const { toggleDataPointsVisibility, image, autoplay } = options || {};

    const selectedData = getSelectedData(
      activeGalaxy,
      answers,
      toggleDataPointsVisibility
    );

    return (
      <>
        <h2 className="space-bottom heading-primary">Galaxy Selector</h2>
        {data && (
          <NavDrawer
            showNavDrawer
            interactableToolbar
            classes={styles.galaxyNavDrawer}
            cardClasses={styles.container}
            contentClasses={styles.galaxyDrawerContent}
            drawerClasses={styles.galaxyDrawer}
            navItems={this.generateNavItems(data)}
            toolbarStyles={
              activeGalaxy ? { backgroundColor: activeGalaxy.color } : null
            }
            toolbarTitle={activeGalaxy ? activeGalaxy.name : 'Galaxy Selector'}
            toolbarActions={<Legend {...{ activeGalaxy, selectedData }} />}
            menuOpenCallback={this.closeScatterPlot}
          >
            <div className="galaxy-selector-images--container">
              <GalaxySelector
                className={`galaxy-selector-${data.name}`}
                {...{ selectedData, activeGalaxy, autoplay }}
                data={getGalaxyPointData(activeGalaxy)}
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
