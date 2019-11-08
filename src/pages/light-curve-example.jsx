import React from 'react';
import SEO from '../components/seo';
import LightCurveContainer from '../containers/LightCurveContainer';

class LightCurveExample extends React.PureComponent {
  render() {
    return (
      <>
        <SEO title="Light Curve Graph" />
        <p>Example Light Curve Graph</p>
        <LightCurveContainer />
      </>
    );
  }
}

export default LightCurveExample;
