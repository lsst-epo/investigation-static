/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import { WithQAing } from './WithQAing';
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

  render() {
    const { activeImageId, activeImageIndex, activeAlert, data } = this.state;
    const {
      data: { alerts, name, band },
      images,
      options: { autoplay, showSelector, showLightCurve },
    } = this.props;
    const activeAlertId = activeAlert ? activeAlert.alert_id.toString() : null;

    return (
      <div className="container-flex spaced">
        {showSelector && (
          <div className={showLightCurve ? 'col padded col-width-50' : 'col'}>
            <SupernovaSelector
              className={`supernova-selector-${name} ${band}-band`}
              name={name}
              band={band}
              data={data}
              images={images}
              alerts={alerts}
              autoplay={autoplay}
              selectionCallback={this.supernovaSelectionCallback}
              blinkCallback={this.onAlertChange}
              activeAlertId={activeAlertId}
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
              name={name}
              band={band}
              data={alerts}
              activeAlertId={activeAlertId}
              activeData={activeAlert ? [activeAlert] : activeAlert}
              dataSelectionCallback={this.lightCurveSelectionCallback}
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
  options: PropTypes.object,
  activeQuestionId: PropTypes.string,
  updateAnswer: PropTypes.func,
};

export default WithQAing(props => (
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
      } = data;

      return (
        <SupernovaSelectorWithLightCurveContainer
          {...props}
          images={images}
          data={supernova}
        />
      );
    }}
  />
));
