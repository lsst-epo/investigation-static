import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import findIndex from 'lodash/findIndex';
import classnames from 'classnames';
import { withTranslation } from 'gatsby-plugin-react-i18next';
import API from '../lib/API.js';
import Navigation from '../components/charts/galaxySelector/Nav.jsx';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import Icon from '../components/site/icons/CustomIcon.jsx';
import ConditionalWrapper from '../components/ConditionalWrapper.jsx';
import HubblePlot from '../components/charts/hubblePlot/index.jsx';
import {
  getSelectedData,
  getGalaxyPointData,
} from '../components/charts/galaxySelector/galaxySelectorUtilities.js';
import { getHubblePlotData } from '../components/charts/hubblePlot/hubblePlotUtilities.js';

import styles from '../components/charts/galaxySelector/galaxy-selector.module.scss';
import navStyle from '../components/charts/shared/navDrawer/nav-drawer.module.scss';

class HubblePlotterContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      plottedData: null,
      selectedData: null,
      activeGalaxyIndex: null,
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
        activeGalaxyIndex: 1,
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

  chooseGalaxyToPlot(activeGalaxy, index) {
    this.setState(prevState => ({
      ...prevState,
      activeGalaxy,
      activeGalaxyIndex: index,
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
      t,
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
          <Icon
            name="galaxy"
            className={`color-${i + 1}-fill`}
            content={name}
          />
        ),
        primaryText: t(name),
        className: classnames(navStyle[`colorizedNavItem${i + 1}`], {
          [navStyle.inactive]: !active,
          [navStyle.active]: active,
          [styles.linkIsComplete]: complete,
          [styles.linkIsNotComplete]: !complete,
          [styles.linkIsDisabled]: disabled,
        }),
        disabled,
        active,
        onClick: () => this.chooseGalaxyToPlot(item, i + 1),
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
    const { data, activeGalaxy, activeGalaxyIndex, plottedData } = this.state;
    const { options, t } = this.props;
    const { qaReview } = options || {};

    return (
      <>
        <h2 className="space-bottom heading-primary">
          {t('widgets::hubble_plotter.title')}
        </h2>
        {data && (
          <ConditionalWrapper
            condition={!qaReview}
            wrapper={children => (
              <NavDrawer
                interactableToolbar
                classes={styles.galaxyNavDrawer}
                cardClasses={styles.container}
                contentClasses={styles.galaxyDrawerContent}
                drawerClasses={styles.galaxyDrawer}
                navItems={this.generateNavItems(data)}
                toolbarTitle={
                  activeGalaxy
                    ? t(activeGalaxy.name)
                    : t('widgets::hubble_plotter.galaxy_name_fallback')
                }
                toolbarActions={
                  <Navigation
                    handlePrevGalaxy={this.gotToPrevGalaxy}
                    handleNextGalaxy={this.goToNextGalaxy}
                  />
                }
                menuOpenCallback={this.closeScatterPlot}
              >
                {children}
              </NavDrawer>
            )}
          >
            <div className={styles.hubblePlotContainer}>
              <HubblePlot
                className="hubble-plot"
                {...{
                  options,
                  activeGalaxy,
                }}
                data={plottedData}
                color={`color-${activeGalaxyIndex}-translucent-fill color-${activeGalaxyIndex}-stroke`}
                userHubblePlotCallback={this.userHubblePlotCallback}
                selectionCallback={this.selectionCallback}
              />
            </div>
          </ConditionalWrapper>
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
  t: PropTypes.func,
};

export default withTranslation()(HubblePlotterContainer);
