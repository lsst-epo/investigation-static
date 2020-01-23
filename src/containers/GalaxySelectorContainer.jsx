/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { NavigationDrawer, Card } from 'react-md';
import API from '../lib/API.js';
import ScatterPlotSelectorContainer from './ScatterPlotSelectorContainer';
import GalaxySelector from '../components/charts/galaxySelector';
import Legend from '../components/charts/galaxySelector/legend';
import Star from '../components/site/icons/Star';
import Toolbar from '../components/charts/galaxySelector/toolbar';
import Navigation from '../components/charts/galaxySelector/Nav.jsx';
import HubblePlot from '../components/charts/hubblePlot/HubblePlot2D.jsx';
import {
  getSelectedData,
  getActiveImageIndex,
  getAlertImages,
  getGalaxyPointData,
} from '../components/charts/galaxySelector/galaxySelectorUtilities.js';
import { getHubblePlotData } from '../components/charts/hubblePlot/hubblePlotUtilities.js';

import './galaxy-selector-container.module.scss';

class GalaxySelectorContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openScatterPlot: false,
      openMenu: false,
      activeImageIndex: 0,
      activeGalaxy: null,
      plottedData: null,
      activeAlertId: null,
      activeAlert: null,
      data: [],
    };
  }

  componentDidMount() {
    const {
      widget: { source },
    } = this.props;

    API.get(source).then(response => {
      const data = response.data.map(galaxy => {
        galaxy.images = getAlertImages(galaxy.name, galaxy.alerts);
        return galaxy;
      });

      const { options, answers } = this.props;

      const { alerts } = data[0];

      this.setState(prevState => ({
        ...prevState,
        activeAlertId: alerts[0].alert_id,
        activeAlert: alerts[0],
        activeGalaxy: data[0],
        data,
        plottedData: getHubblePlotData(data, options, answers),
      }));
    });
  }

  chooseGalaxyAndCloseNav(event, activeGalaxy) {
    if (event) {
      const { openScatterPlot } = this.state;
      const { alerts } = activeGalaxy;

      if (openScatterPlot) this.triggerScatterPlot('close');

      this.setState(prevState => ({
        ...prevState,
        activeGalaxy,
        activeImageIndex: 0,
        activeAlertId: alerts[0].alert_id,
        activeAlert: alerts[0],
      }));

      this.handleCloseMenu();
    }
  }

  handleOpenMenu = () => {
    this.setState(prevState => ({
      ...prevState,
      openMenu: true,
    }));
  };

  handleCloseMenu = () => {
    this.setState(prevState => ({
      ...prevState,
      openMenu: false,
    }));
  };

  handleLeftNavigationDrawerVisibility = visibility => {
    this.setState(prevState => ({
      ...prevState,
      openMenu: visibility,
    }));
  };

  triggerScatterPlot = () => {
    this.setState(prevState => ({
      ...prevState,
      openScatterPlot: !prevState.openScatterPlot,
    }));
  };

  gotToPrevGalaxy = () => {
    this.goToGalaxy(-1);
  };

  goToNextGalaxy = () => {
    this.goToGalaxy(1);
  };

  goToGalaxy(direction) {
    const { activeGalaxy: oldActiveGalaxy, data } = this.state;
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

    const { alerts } = activeGalaxy;

    this.setState(prevState => ({
      ...prevState,
      activeGalaxy,
      activeImageIndex: 0,
      activeAlertId: alerts[0].alert_id,
      activeAlert: alerts[0],
    }));
  }

  generateNavItems = navItems => {
    const { activeGalaxy } = this.state;
    const {
      answers,
      options: { toggleDataPointsVisibility },
    } = this.props;
    const answer = answers[toggleDataPointsVisibility];
    const answerData = !isEmpty(answer) ? answer.data : {};

    return navItems.map(item => {
      const { name, color } = item;
      const itemAnswerData = answerData[name];

      const active = name === activeGalaxy.name;
      const complete = itemAnswerData ? itemAnswerData.length === 2 : false;
      const disabled = false;

      return {
        leftAvatar: <Star style={{ fill: color }} />,
        primaryText: name,
        className: classnames('galaxy-item', 'link-item', {
          'link-active': active,
          'link-is-complete': complete,
          'link-is-not-complete': !complete,
          'link-is-disabled': disabled,
        }),
        disabled,
        active,
        onClick: e => this.chooseGalaxyAndCloseNav(e, item),
      };
    });
  };

  selectionCallback = d => {
    const {
      answers,
      updateAnswer,
      activeQuestionId,
      options: { toggleDataPointsVisibility },
    } = this.props;
    const { activeGalaxy } = this.state;

    const qId = toggleDataPointsVisibility || activeQuestionId;
    const dObj = { [activeGalaxy.name]: d };
    const answer = answers[qId];
    const answerObj = !isEmpty(answer) ? { ...answer.data, ...dObj } : dObj;

    if (qId) {
      updateAnswer(qId, answerObj);
    }

    if (d.length > 1) {
      this.triggerScatterPlot();
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
      openMenu,
      openScatterPlot,
      activeGalaxy,
      plottedData,
    } = this.state;

    const {
      answers,
      options,
      options: { toggleDataPointsVisibility },
    } = this.props;

    const selectedData = getSelectedData(
      activeGalaxy,
      answers,
      toggleDataPointsVisibility
    );

    return (
      <>
        <Toolbar
          {...{ activeGalaxy, openMenu }}
          onMenuClose={this.handleCloseMenu}
          onMenuOpen={this.handleOpenMenu}
          scatterPlotTrigger={this.triggerScatterPlot}
          openScatterPlot={openScatterPlot}
        />
        <Card className="galaxy-selector-container">
          <NavigationDrawer
            navItems={this.generateNavItems(data)}
            position="left"
            className="galaxy-selector--navigation-drawer"
            visible={openMenu}
            onVisibilityChange={this.handleLeftNavigationDrawerVisibility}
            mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
            tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
            desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
            contentClassName="main-galaxy-selector-content"
            overlay={false}
          >
            <div className="galaxy-selector-images--container">
              <Legend {...{ activeGalaxy, selectedData }} />
              <GalaxySelector
                className={`galaxy-selector-${data.name}`}
                {...{ selectedData, activeGalaxy }}
                data={getGalaxyPointData(activeGalaxy)}
                alerts={activeGalaxy ? activeGalaxy.alerts : []}
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
          </NavigationDrawer>

          <ScatterPlotSelectorContainer
            opened={openScatterPlot || false}
            handleClick={this.triggerScatterPlot}
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
          </ScatterPlotSelectorContainer>
          <Navigation
            handlePrevGalaxy={this.gotToPrevGalaxy}
            handleNextGalaxy={this.goToNextGalaxy}
          />
        </Card>
      </>
    );
  }
}

GalaxySelectorContainer.propTypes = {
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  activeAnswer: PropTypes.object,
  options: PropTypes.object,
  widget: PropTypes.object,
  updateAnswer: PropTypes.func,
};

export default props => <GalaxySelectorContainer {...props} />;
