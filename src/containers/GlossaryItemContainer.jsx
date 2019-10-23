import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Layout from '../components/layout';
import GlossaryItem from '../components/glossaryItem';

class GlossaryItemContainer extends React.PureComponent {
  render() {
    const { data } = this.props;
    const { title, definition } = data.craft.entries[0];

    return (
      <Layout>
        <GlossaryItem word={title} def={definition.content} />
      </Layout>
    );
  }
}

export default GlossaryItemContainer;

GlossaryItemContainer.propTypes = {
  data: PropTypes.object,
};

export const query = graphql`
  query PageQuery($id: [Int]!, $site: String) {
    craft {
      entries(limit: 1, id: $id, siteId: $site) {
        ... on CraftGraphQL_glossary_glossary_Entry {
          id
          title
          definition
        }
      }
    }
  }
`;
