/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import LightCurve from '../components/charts/lightCurve/index.jsx';

class LightCurveContainer extends React.PureComponent {
  render() {
    const {
      data: { alerts, name, band },
    } = this.props;

    return (
      <>
        <LightCurve
          className={`light-curve-${name} ${band}-band`}
          name={name}
          band={band}
          data={alerts}
        />
      </>
    );
  }
}

LightCurveContainer.propTypes = {
  data: PropTypes.object,
};

export default props => (
  <StaticQuery
    query={graphql`
      query LightCurveQuery {
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
      }
    `}
    render={data => {
      const {
        allSupernovaeJson: {
          nodes: { 0: supernova },
        },
      } = data;

      return <LightCurveContainer {...props} data={supernova} />;
    }}
  />
);
