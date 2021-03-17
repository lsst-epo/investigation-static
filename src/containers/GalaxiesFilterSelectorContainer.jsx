import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import API from '../lib/API.js';
import ConditionalWrapper from '../components/ConditionalWrapper';
import GalaxySelector from '../components/charts/galaxySelector';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import StarAvatar from '../components/charts/shared/navDrawer/StarAvatar.jsx';
import { getSelectedData } from '../components/charts/galaxySelector/galaxySelectorUtilities.js';

import styles from '../components/charts/galaxySelector/galaxy-selector.module.scss';

class GalaxiesFilterSelectorContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
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
      const { data } = response || {};
      const { objects } = data[0] || {};

      this.setState(prevState => ({
        ...prevState,
        activeGalaxy: data[0],
        activeGalaxyPointData: objects,
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

  chooseGalaxy(event, activeGalaxy) {
    if (event) {
      const { answers, options } = this.props;
      const { toggleDataPointsVisibility: qId } = options || {};

      this.setState(prevState => ({
        ...prevState,
        activeGalaxy,
        activeGalaxyPointData: activeGalaxy.objects,
        selectedData: getSelectedData(activeGalaxy, answers, qId),
      }));
    }
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
        onClick: e => this.chooseGalaxy(e, item),
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

      updateAnswer(qId, answerObj, 'change');
    }
  };

  render() {
    const {
      data,
      activeGalaxy,
      activeGalaxyPointData,
      selectedData,
    } = this.state;

    const { widget } = this.props;
    const {
      options: { preSelected },
    } = widget || {};

    return (
      <>
        <h2 className="space-bottom heading-primary">
          Galaxies Filter Selector
        </h2>
        {data && (
          <ConditionalWrapper
            condition={data.length > 1}
            wrapper={children => (
              <NavDrawer
                interactableToolbar
                classes={styles.galaxyNavDrawer}
                cardClasses={styles.container}
                contentClasses={styles.galaxyDrawerContent}
                drawerClasses={styles.galaxyDrawer}
                navItems={this.generateNavItems(data)}
                toolbarTitle={
                  activeGalaxy ? activeGalaxy.name : 'Galaxies Filter Selector'
                }
                menuOpenCallback={this.closeScatterPlot}
              >
                {children}
              </NavDrawer>
            )}
          >
            <div className="galaxy-selector-images--container">
              <GalaxySelector
                className={`galaxy-selector-${data.name}`}
                {...{ selectedData, activeGalaxy, preSelected }}
                data={activeGalaxyPointData}
                image={activeGalaxy.image}
                selectionCallback={this.selectionCallback}
              />
            </div>
          </ConditionalWrapper>
        )}
      </>
    );
  }
}

GalaxiesFilterSelectorContainer.propTypes = {
  widget: PropTypes.object,
  options: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  updateAnswer: PropTypes.func,
};

export default GalaxiesFilterSelectorContainer;
