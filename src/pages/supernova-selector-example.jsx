import React from 'react';
import SEO from '../components/seo';
import SupernovaSelectorContainer from '../containers/SupernovaSelectorContainer';

class SupernovaSelectorExample extends React.PureComponent {
  render() {
    return (
      <>
        <SEO title="Supernova Selector" />
        <p>Example Supernova Selector</p>
        <SupernovaSelectorContainer />
      </>
    );
  }
}

export default SupernovaSelectorExample;
