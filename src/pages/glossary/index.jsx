import React from 'react';
import { Link, graphql } from 'gatsby';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import Layout from '../../components/layout';
import SEO from '../../components/seo';

@reactn
class Glossary extends React.PureComponent {
  renderEntries(entries) {
    return entries.map(entry => {
      const { title, slug } = entry;
      return (
        <div key={title}>
          <Link to={`/glossary/${slug}`}>{title}</Link>
        </div>
      );
    });
  }

  render() {
    const { totalNumPages } = this.global;
    const { data } = this.props;
    const { entries } = data.craft;

    return (
      <Layout>
        <SEO title="Glossary" />
        <h1>Glossary!</h1>
        <div>{this.renderEntries(entries)}</div>
        <Link to="/">Go back to the homepage</Link>
        {totalNumPages}
      </Layout>
    );
  }
}

export default Glossary;

Glossary.propTypes = {
  data: PropTypes.object,
};

export const query = graphql`
  query {
    craftql {
      entries(type: Glossary) {
        ...GlossaryFields
      }
    }
  }
`;
