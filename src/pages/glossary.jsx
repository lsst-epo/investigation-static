import React from 'react';
import { graphql, Link } from 'gatsby';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import GlossaryItem from '../components/glossaryItem';
import Layout from '../components/layout';
import SEO from '../components/seo';

@reactn
class Glossary extends React.PureComponent {
  renderEntries(entries) {
    return entries.map(entry => {
      const { title, definition } = entry;

      return <GlossaryItem key={title} word={title} def={definition} />;
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
    craft {
      entries(type: "glossary") {
        ...GlossaryFields
      }
    }
  }
`;
