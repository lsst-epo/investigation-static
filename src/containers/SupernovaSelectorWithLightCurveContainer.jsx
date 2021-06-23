import React from 'react';
import PropTypes from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import API from '../lib/API.js';
import {
  getSelectedData,
  getActiveImageIndex,
  getAlertImages,
  getSupernovaPointData,
} from '../components/charts/galaxySelector/galaxySelectorUtilities.js';
import {
  getPeakMagAnswer,
  getTemplateAnswer,
} from '../components/charts/lightCurve/lightCurveUtilities.js';
import SupernovaSelector from '../components/charts/galaxySelector/index.jsx';
import LightCurve from '../components/charts/lightCurve/index.jsx';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import Star from '../components/site/icons/Star';
import Legend from '../components/charts/shared/legend/index.jsx';
import LegendItem from '../components/charts/shared/legend/LegendItem.jsx';
import ConditionalWrapper from '../components/ConditionalWrapper';

import {
  galaxyItem,
  linkActive,
} from '../components/charts/galaxySelector/galaxy-selector.module.scss';
import { container } from '../components/charts/lightCurve/light-curve.module.scss';
import { paddedDrawerInner } from '../components/charts/shared/navDrawer/nav-drawer.module.scss';

class SupernovaSelectorWithLightCurveContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      activeGalaxy: null,
      activeImageIndex: 0,
      activeImageId: null,
      activeAlert: null,
      navItems: [],
    };
  }

  componentDidMount() {
    const {
      widget: { source },
    } = this.props;

    API.get(source).then(response => {
      const data = response.data.map(supernova => {
        supernova.images = getAlertImages(supernova.name, supernova.alerts);
        return supernova;
      });

      const activeGalaxy = data[0];
      const { alerts } = activeGalaxy;

      this.setState(prevState => ({
        ...prevState,
        alerts,
        activeAlert: alerts[0],
        activeGalaxy,
        data,
        navItems: this.generateNavItems(data, activeGalaxy),
      }));
    });
  }

  setActiveGalaxy = galaxy => {
    const { data } = this.state;
    const { alerts } = galaxy;
    const navItems = this.generateNavItems(data, galaxy);

    this.setState(prevState => ({
      ...prevState,
      alerts,
      activeAlert: alerts[0],
      activeGalaxy: galaxy,
      navItems,
    }));
  };

  supernovaSelectionCallback = d => {
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

    if (d.length >= 1) {
      this.setState(prevState => ({
        ...prevState,
      }));
    }
  };

  lightCurveSelectionCallback = (id, d) => {
    const activeAlert = d[0];

    this.setState(prevState => ({
      ...prevState,
      activeAlert,
    }));
  };

  onAlertChange = update => {
    this.setState(prevState => ({
      ...prevState,
      ...update,
    }));
  };

  generateNavItems(galaxies, activeGalaxy) {
    return galaxies.map(galaxy => {
      const { name, color } = galaxy;
      return {
        leftAvatar: (
          <span>
            <Star style={{ fill: color }} />
            <span className="screen-reader-only">{name}</span>
          </span>
        ),
        primaryText: name,
        className: classnames(galaxyItem, {
          [linkActive]: activeGalaxy === galaxy,
        }),
        onClick: () => this.setActiveGalaxy(galaxy),
      };
    });
  }

  createLegend(data) {
    if (!data) return null;

    return (
      <Legend>
        {data.map((d, i) => {
          const key = `${d.name}-${i}`;
          return <LegendItem key={key} name={d.name} color={d.color} />;
        })}
      </Legend>
    );
  }

  render() {
    const {
      data,
      activeGalaxy,
      alerts,
      activeImageIndex,
      activeAlert,
      navItems,
      xDomain,
      yDomain,
    } = this.state;

    const {
      answers,
      activeAnswer,
      templatesData,
      activeQuestionId,
      updateAnswer,
      options,
    } = this.props;
    const {
      autoplay,
      loop,
      showSelector,
      showLightCurve,
      lightCurveTemplates,
      preSelectedLightCurveTemplate,
      preSelectedLightCurveMagnitude,
      preSelected,
      toggleDataPointsVisibility: selectorQId,
      multiple,
      legend,
    } = options || {};

    const { transform, type, templateAnswerId } = getTemplateAnswer(
      lightCurveTemplates,
      preSelectedLightCurveTemplate,
      answers
    );
    const { x, y, peakMagAnswerId } = getPeakMagAnswer(
      preSelectedLightCurveMagnitude,
      answers
    );
    const name = activeGalaxy ? activeGalaxy.name : 'name';
    const band = activeGalaxy ? activeGalaxy.band : 'band';

    const selectedData = getSelectedData(activeGalaxy, answers, selectorQId);

    return (
      <div className="container-flex spaced">
        {data && showSelector && (
          <div className={showLightCurve ? 'col padded col-width-50' : 'col'}>
            <h2 className="space-bottom">Supernova Images</h2>
            <ConditionalWrapper
              condition={data ? data.length > 1 : false}
              wrapper={children => (
                <NavDrawer
                  interactableToolbar
                  navItems={navItems}
                  toolbarTitle={activeGalaxy ? activeGalaxy.name : null}
                >
                  {children}
                </NavDrawer>
              )}
            >
              <SupernovaSelector
                className={`supernova-selector-${name}`}
                autoplay={autoplay && !selectedData}
                loop={loop}
                {...{ selectedData, activeGalaxy, preSelected }}
                data={getSupernovaPointData(activeGalaxy)}
                alerts={activeGalaxy ? activeGalaxy.alerts : []}
                images={activeGalaxy ? activeGalaxy.images : []}
                selectionCallback={this.supernovaSelectionCallback}
                blinkCallback={this.onAlertChange}
                activeImageId={activeAlert ? activeAlert.image_id : null}
                activeImageIndex={getActiveImageIndex(
                  activeGalaxy,
                  activeAlert,
                  activeImageIndex
                )}
              />
            </ConditionalWrapper>
          </div>
        )}
        {(data || alerts) && showLightCurve && (
          <div className={showSelector ? 'col padded col-width-50' : 'col'}>
            <h2 className="space-bottom">Light Curve</h2>
            <ConditionalWrapper
              condition={data && !multiple ? data.length > 1 : false}
              wrapper={children => (
                <NavDrawer
                  cardClasses={container}
                  interactableToolbar
                  navItems={navItems}
                  toolbarTitle={activeGalaxy ? activeGalaxy.name : null}
                  contentClasses={paddedDrawerInner}
                >
                  {children}
                </NavDrawer>
              )}
            >
              <LightCurve
                className={`light-curve-${name} ${band}-band`}
                data={multiple ? data : alerts}
                {...{
                  name,
                  band,
                  templatesData,
                  peakMagAnswerId,
                  templateAnswerId,
                  activeAnswer,
                  activeQuestionId,
                  multiple,
                  xDomain,
                  yDomain,
                }}
                pointColor={activeGalaxy ? activeGalaxy.color : '#BEE7F5'}
                legend={legend ? this.createLegend(data) : null}
                activeAlertId={
                  activeAlert ? activeAlert.alert_id.toString() : null
                }
                interactableTemplates={
                  !!activeQuestionId && activeQuestionId === templateAnswerId
                }
                interactablePeakMag={
                  !!activeQuestionId && peakMagAnswerId === activeQuestionId
                }
                pointsAreVisible={
                  selectorQId ? !isEmpty(answers[selectorQId]) : true
                }
                templates={lightCurveTemplates}
                activePeakMag={{ peakMagX: x, peakMagY: y }}
                activeTemplate={type}
                templateTransform={transform}
                activeData={activeAlert && showSelector ? [activeAlert] : null}
                dataSelectionCallback={this.lightCurveSelectionCallback}
                templateZoomCallback={updateAnswer}
                peakMagCallback={updateAnswer}
              />
            </ConditionalWrapper>
          </div>
        )}
      </div>
    );
  }
}

SupernovaSelectorWithLightCurveContainer.propTypes = {
  images: PropTypes.array,
  templatesData: PropTypes.object,
  options: PropTypes.object,
  widget: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  activeAnswer: PropTypes.object,
  updateAnswer: PropTypes.func,
  preSelected: PropTypes.bool,
  toggleDataPointsVisibility: PropTypes.string,
};

export default props => (
  <StaticQuery
    query={graphql`
      query SupernovaSelectorLightCurveQuery {
        allSnIaBtemplateJson {
          nodes {
            id
            x
            y
          }
        }
        allSnIaVtemplateJson {
          nodes {
            id
            x
            y
          }
        }
        allSniIpVtemplateJson {
          nodes {
            id
            x
            y
          }
        }
      }
    `}
    render={data => {
      const {
        allSniIpVtemplateJson: { nodes: iipVJson },
        allSnIaVtemplateJson: { nodes: iaVJson },
        allSnIaBtemplateJson: { nodes: iaBJson },
      } = data;

      return (
        <SupernovaSelectorWithLightCurveContainer
          {...props}
          templatesData={{ Ia: iaBJson, Iav: iaVJson, IIp: iipVJson }}
        />
      );
    }}
  />
);
