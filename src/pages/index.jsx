import React from 'react';
import { Link } from 'gatsby';
import SEO from '../components/seo';
import logo from '../images/lsst-logo.svg';

const IndexPage = () => (
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
    <Link to="/introduction/">Go to Investigation</Link>
  </>
);

export default IndexPage;
