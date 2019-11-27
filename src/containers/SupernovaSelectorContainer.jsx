/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
/* eslint-disable no-unused-vars */
import Img from 'gatsby-image';
/* eslint-enable no-unused-vars */
import SupernovaSelector from '../components/charts/supernovaSelector';

class SupernovaSelectorContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeImageIndex: 0,
      activeAlertId: null,
      data: [{ id: 'ZTF19abqmpsr', band: 'r', x: 600, y: 600 }],
    };
  }

  selectionCallback = () => {
    // console.log(d ? `${d[0].id} is selected` : 'no selection');
  };

  onAlertChange = update => {
    this.setState(
      prevState => ({
        ...prevState,
        ...update,
      }),
      () => {
        // const { activeAlertId } = this.state;
        // console.log(activeAlertId);
      }
    );
  };

  render() {
    const { activeAlertId, activeImageIndex, data } = this.state;
    const {
      data: { name, band },
      images,
    } = this.props;

    return (
      <div style={{ maxWidth: '600px' }}>
        <SupernovaSelector
          className={`supernova-selector-${name} ${band}-band`}
          name={name}
          band={band}
          data={data}
          images={images}
          selectionCallback={this.selectionCallback}
          blinkCallback={this.onAlertChange}
          activeAlertId={activeAlertId}
          activeImageIndex={activeImageIndex}
        />
      </div>
    );
  }
}

SupernovaSelectorContainer.propTypes = {
  images: PropTypes.array,
  data: PropTypes.object,
};

export default props => (
  <StaticQuery
    query={graphql`
      query SupernovaSelectorQuery {
        allSupernovaeJson(filter: { name: { eq: "ZTF19abqmpsr" } }) {
          nodes {
            band
            name
            alerts {
              alert_id
              error
              date
              magnitude
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
        <SupernovaSelectorContainer
          {...props}
          images={images}
          data={supernova}
        />
      );
    }}
  />
);
