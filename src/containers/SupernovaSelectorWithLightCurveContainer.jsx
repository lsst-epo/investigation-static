import React from 'react';
import PropTypes from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import isEmpty from 'lodash/isEmpty';
import { zoomIdentity as d3ZoomIdentity } from 'd3-zoom';
import { getActiveIndex } from '../components/charts/supernovaSelector/supernovaSelectorUtilities.js';
import SupernovaSelector from '../components/charts/supernovaSelector';
import LightCurve from '../components/charts/lightCurve/index.jsx';

class SupernovaSelectorWithLightCurveContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeImageIndex: 0,
      activeImageId: null,
      activeAlert: null,
      data: [{ id: 'ZTF19abqmpsr', band: 'r', x: 600, y: 600 }],
    };
  }

  componentDidMount() {
    const {
      images,
      data: { alerts },
      options: { showSelector },
    } = this.props;
    const { activeAlert } = this.state;

    if (!activeAlert && showSelector) {
      this.setState(prevState => ({
        ...prevState,
        activeImageId: images[0].image_id,
        activeAlert: alerts[0],
      }));
    }
  }

  supernovaSelectionCallback = d => {
    const { updateAnswer, activeQuestionId } = this.props;
    const activeSupernova = d ? d[0].id : null;

    if (activeQuestionId) {
      updateAnswer(activeQuestionId, activeSupernova);
    }
  };

  templateZoomCallback = d => {
    const { updateAnswer, activeQuestionId } = this.props;
    updateAnswer(activeQuestionId, d);
  };

  peakMagCallback = d => {
    const { updateAnswer, activeQuestionId } = this.props;
    updateAnswer(activeQuestionId, d);
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

  getActiveImageIndex(activeAlert, activeImageIndex) {
    const { images } = this.props;

    if (activeAlert) {
      return getActiveIndex(images, activeAlert.image_id);
    }

    return activeImageIndex;
  }

  getTemplateAnswer(templates, typeOrAnswerId) {
    const { answers } = this.props;
    const answer = answers[typeOrAnswerId];
    const isAnswered = !isEmpty(answer);
    const empty = {
      transform: d3ZoomIdentity,
      type: '',
      templateAnswerId: typeOrAnswerId,
    };

    if (isAnswered) {
      return {
        ...empty,
        transform: isAnswered ? answer.data.data : null,
        type: isAnswered ? answer.data.type : null,
      };
    }

    if (!templates) {
      return empty;
    }

    if (templates.length === 1) {
      return {
        ...empty,
        type: templates[0],
      };
    }

    return empty;
  }

  getPeakMagAnswer(answerId) {
    const { answers } = this.props;
    const answer = answers[answerId];
    const isAnswered = !isEmpty(answer);
    const empty = { x: null, y: null, value: null, peakMagAnswerId: answerId };
    if (isAnswered) {
      return { ...empty, ...answer.data };
    }

    return empty;
  }

  render() {
    const { activeImageId, activeImageIndex, activeAlert, data } = this.state;
    const {
      data: { alerts, name, band },
      answers,
      activeAnswer,
      templatesData,
      images,
      activeQuestionId,
      options: {
        autoplay,
        showSelector,
        showLightCurve,
        lightCurveTemplates,
        chooseLightCurveTemplate,
        preSelectedLightCurveTemplate,
        preSelectedLightCurveMagnitude,
        preSelected,
        toggleDataPointsVisibility: selectorQId,
      },
    } = this.props;

    const activeAlertId = activeAlert ? activeAlert.alert_id.toString() : null;
    const supernovaSelected =
      (showSelector || showLightCurve) && !isEmpty(answers[selectorQId]);
    const { transform, type, templateAnswerId } = this.getTemplateAnswer(
      lightCurveTemplates,
      preSelectedLightCurveTemplate
    );
    const { x, y, peakMagAnswerId } = this.getPeakMagAnswer(
      preSelectedLightCurveMagnitude
    );

    return (
      <div className="container-flex spaced">
        {showSelector && (
          <div className={showLightCurve ? 'col padded col-width-50' : 'col'}>
            <SupernovaSelector
              className={`supernova-selector-${name} ${band}-band`}
              {...{
                data,
                name,
                band,
                images,
                alerts,
                autoplay,
                activeAlertId,
                preSelected,
                supernovaSelected,
              }}
              selectionCallback={this.supernovaSelectionCallback}
              blinkCallback={this.onAlertChange}
              activeImageId={activeAlert ? activeAlert.image_id : activeImageId}
              activeImageIndex={this.getActiveImageIndex(
                activeAlert,
                activeImageIndex
              )}
            />
          </div>
        )}
        {showLightCurve && (
          <div className={showSelector ? 'col padded col-width-50' : 'col'}>
            <LightCurve
              className={`light-curve-${name} ${band}-band`}
              data={alerts}
              {...{
                name,
                band,
                templatesData,
                activeAlertId,
                activeAnswer,
                activeQuestionId,
                chooseLightCurveTemplate,
              }}
              interactableTemplates={activeQuestionId === templateAnswerId}
              interactablePeakMag={peakMagAnswerId === activeQuestionId}
              pointsAreVisible={selectorQId ? supernovaSelected : true}
              templates={lightCurveTemplates}
              activePeakMag={{ peakMagX: x, peakMagY: y }}
              activeTemplate={type}
              templateTransform={transform}
              activeData={activeAlert ? [activeAlert] : activeAlert}
              dataSelectionCallback={this.lightCurveSelectionCallback}
              templateZoomCallback={this.templateZoomCallback}
              peakMagCallback={this.peakMagCallback}
            />
          </div>
        )}
      </div>
    );
  }
}

SupernovaSelectorWithLightCurveContainer.propTypes = {
  images: PropTypes.array,
  data: PropTypes.object,
  templatesData: PropTypes.object,
  options: PropTypes.object,
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
        allSupernovaeJson(filter: { name: { eq: "ZTF19abqmpsr" } }) {
          nodes {
            band
            name
            alerts {
              alert_id
              error
              date
              magnitude
              image_id
            }
          }
        }
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
        allFile(
          filter: { relativeDirectory: { eq: "supernovae/ZTF19abqmpsr" } }
        ) {
          nodes {
            childImageSharp {
              fluid {
                originalName
                presentationHeight
                presentationWidth
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    `}
    render={data => {
      const {
        allSupernovaeJson: {
          nodes: { 0: supernova },
        },
        allFile: { nodes: images },
        allSniIpVtemplateJson: { nodes: iipVJson },
        allSnIaVtemplateJson: { nodes: iaVJson },
        allSnIaBtemplateJson: { nodes: iaBJson },
      } = data;

      return (
        <SupernovaSelectorWithLightCurveContainer
          {...props}
          images={images}
          data={supernova}
          templatesData={{ iab: iaBJson, iav: iaVJson, iip: iipVJson }}
        />
      );
    }}
  />
);
