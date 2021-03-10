import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import findIndex from 'lodash/findIndex';
import classnames from 'classnames';
import API from '../lib/API.js';
import Navigation from '../components/charts/galaxySelector/Nav.jsx';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import StarAvatar from '../components/charts/shared/navDrawer/StarAvatar.jsx';
import HubblePlot from '../components/charts/hubblePlot/index.jsx';
import {
  getSelectedData,
  getGalaxyPointData,
} from '../components/charts/galaxySelector/galaxySelectorUtilities.js';
import { getHubblePlotData } from '../components/charts/hubblePlot/hubblePlotUtilities.js';

import styles from '../components/charts/galaxySelector/galaxy-selector.module.scss';

class HubblePlotterContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      plottedData: null,
      selectedData: null,
      activeGalaxy: null,
      activeGalaxyPointData: null,
      openMenu: false,
    };
  }

  componentDidMount() {
    const {
      widget: { source },
    } = this.props;

    API.get(source).then(response => {
      const { data } = response;
      const { options, answers } = this.props;

      this.setState(prevState => ({
        ...prevState,
        activeGalaxy: data[0],
        activeGalaxyPointData: getGalaxyPointData(data[0]),
        data,
        plottedData: getHubblePlotData(data, options, answers),
      }));
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { options, answers } = this.props;
    const { createUserHubblePlot: hubbleQId } = options || {};
    const answer = answers[hubbleQId];
    const { data, activeGalaxy } = this.state;
    const { answers: prevAnswers } = prevProps;
    const answerPrev = prevAnswers[hubbleQId];
    const { data: prevData, activeGalaxy: prevActiveGalaxy } = prevState;

    if (data !== prevData || answer !== answerPrev) {
      this.updateHubblePlotData(data, options, answers);
    }

    if (activeGalaxy !== prevActiveGalaxy) {
      this.updateSelectedData(activeGalaxy, answers, hubbleQId);
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

  chooseGalaxyToPlot(activeGalaxy) {
    this.setState(prevState => ({
      ...prevState,
      activeGalaxy,
      activeGalaxyPointData: getGalaxyPointData(activeGalaxy),
    }));
  }

  gotToPrevGalaxy = () => {
    this.goToGalaxy(-1);
  };

  goToNextGalaxy = () => {
    this.goToGalaxy(1);
  };

  goToGalaxy(direction) {
    const { activeGalaxy: oldActiveGalaxy, data } = this.state;
    const lastIndex = data.length - 1;
    const oldIndex = findIndex(data, { id: oldActiveGalaxy.id });
    const index = oldIndex + direction;
    let activeGalaxy = oldActiveGalaxy;
    if (index < 0) {
      activeGalaxy = data[lastIndex];
    } else if (index > lastIndex) {
      activeGalaxy = data[0];
    } else {
      activeGalaxy = data[index];
    }

    this.setState(prevState => ({
      ...prevState,
      activeGalaxy,
      activeGalaxyPointData: getGalaxyPointData(activeGalaxy),
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
        className: classnames(styles.galaxyItem, `galaxy-item-${i + 1}`, {
          'link-active': active,
          [styles.linkIsComplete]: complete,
          [styles.linkIsNotComplete]: !complete,
          [styles.linkIsDisabled]: disabled,
        }),
        disabled,
        active,
        onClick: () => this.chooseGalaxyToPlot(item),
      };
    });
  }

  selectionCallback = d => {
    const activeGalaxy = isArray(d) ? d[0] : d;
    this.setState(prevState => ({
      ...prevState,
      activeGalaxy: activeGalaxy || prevState.activeGalaxy,
      activeGalaxyPointData: getGalaxyPointData(
        activeGalaxy || prevState.activeGalaxy
      ),
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
    const { data, activeGalaxy, plottedData } = this.state;

    const { options } = this.props;

    return (
      <>
        <h2 className="space-bottom heading-primary">Hubble Plot</h2>
        {data && (
          <NavDrawer
            interactableToolbar
            classes={styles.galaxyNavDrawer}
            cardClasses={styles.container}
            contentClasses={styles.galaxyDrawerContent}
            drawerClasses={styles.galaxyDrawer}
            navItems={this.generateNavItems(data)}
            toolbarTitle={activeGalaxy ? activeGalaxy.name : 'Galaxy Selector'}
            toolbarActions={
              <Navigation
                handlePrevGalaxy={this.gotToPrevGalaxy}
                handleNextGalaxy={this.goToNextGalaxy}
              />
            }
            menuOpenCallback={this.closeScatterPlot}
          >
            <div className={styles.hubblePlotContainer}>
              <HubblePlot
                className="hubble-plot"
                {...{
                  options,
                  activeGalaxy,
                }}
                data={plottedData}
                userHubblePlotCallback={this.userHubblePlotCallback}
                selectionCallback={this.selectionCallback}
              />
            </div>
          </NavDrawer>
        )}
      </>
    );
  }
}

HubblePlotterContainer.propTypes = {
  widget: PropTypes.object,
  options: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  updateAnswer: PropTypes.func,
};

export default HubblePlotterContainer;
