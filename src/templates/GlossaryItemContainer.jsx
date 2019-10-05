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
        <GlossaryItem word={title} def={definition} />
      </Layout>
    );
  }
}

export default GlossaryItemContainer;

GlossaryItemContainer.propTypes = {
  data: PropTypes.object,
};

export const query = graphql`
  query PageQuery($id: [Int]!) {
    craft {
      entries(type: "glossary", id: $id, limit: 1) {
        ...GlossaryFields
      }
    }
  }
`;
