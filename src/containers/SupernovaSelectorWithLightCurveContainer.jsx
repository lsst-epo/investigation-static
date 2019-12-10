import React from 'react';
import PropTypes from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
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
      activeSupernova: null,
      data: [{ id: 'ZTF19abqmpsr', band: 'r', x: 600, y: 600 }],
    };
  }

  componentDidMount() {
    const {
      images,
      data: { alerts },
    } = this.props;
    const { activeAlert } = this.state;

    if (!activeAlert) {
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

    updateAnswer(activeQuestionId, activeSupernova);

    this.setState(prevState => ({
      ...prevState,
      activeSupernova,
    }));
  };

  templateZoomCallback = d => {
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

  getPreSelectedLightCurveTemplate(template) {
    const { answers } = this.props;

    if (isObject(template)) {
      return template;
    }

    if (isString(template)) {
      const answer = answers[template];

      if (isEmpty(answer)) return {};

      return {
        transform: answer.data.data,
        type: answer.data.type,
        templateAnswerId: template,
      };
    }

    return {};
  }

  render() {
    const { activeImageId, activeImageIndex, activeAlert, data } = this.state;
    const {
      data: { alerts, name, band },
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
        preSelected,
      },
    } = this.props;
    const activeAlertId = activeAlert ? activeAlert.alert_id.toString() : null;
    const {
      transform,
      type,
      templateAnswerId,
    } = this.getPreSelectedLightCurveTemplate(preSelectedLightCurveTemplate);

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
                templateAnswerId,
              }}
              templates={lightCurveTemplates}
              activeTemplate={type}
              chooseLightCurveTemplate={chooseLightCurveTemplate}
              templateTransform={transform}
              activeData={activeAlert ? [activeAlert] : activeAlert}
              dataSelectionCallback={this.lightCurveSelectionCallback}
              templateZoomCallback={this.templateZoomCallback}
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
