import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import SEO from '../components/seo';
import logo from '../images/lsst-logo.svg';

class IndexPage extends React.PureComponent {
  render() {
    const {
      data: {
        allInvestigationsJson: { nodes: investigations },
      },
    } = this.props;
    return (
      <>
        <SEO title="Home" />
        <p>Investigation Landing Page.</p>

        <div
          style={{
            maxWidth: `300px`,
            marginTop: `1.45rem`,
            marginBottom: `1.45rem`,
          }}
        >
          <img src={logo} alt="logo" />
        </div>
        {investigations.map(investigation => {
          const { id, title } = investigation;
          return (
            <div key={id}>
              <Link to={`/${id}/`}>Go to {title} Investigation</Link>
            </div>
          );
        })}
      </>
    );
  }
}

export default IndexPage;

IndexPage.propTypes = {
  data: PropTypes.object,
};

export const query = graphql`
  query HomeQuery {
    allInvestigationsJson {
      nodes {
        id
        title
      }
    }
  }
`;
