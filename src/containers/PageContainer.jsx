/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import reactn from 'reactn';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Page from '../components/page';
import TwoCol from '../components/page/TwoCol.jsx';
import PageNav from '../components/page/PageNav.jsx';

@reactn
class PageContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.layouts = {
      default: Page,
      'two-col': TwoCol,
      'single-col': Page,
    };
  }

  componentDidMount() {
    const { data } = this.props;
    const page = data.allPagesJson.nodes[0];

    this.dispatch.updatePageId(page.id);
  }

  render() {
    const { data } = this.props;
    const childProps = data.allPagesJson.nodes[0];
    const Tag = this.layouts[childProps.layout || 'default'];

    return (
      <div className="container-page">
        <Tag {...childProps} />
        <PageNav previous={childProps.previous} next={childProps.next} />
      </div>
    );
  }
}

export default PageContainer;

PageContainer.propTypes = {
  data: PropTypes.object,
};

export const query = graphql`
  query PageQuery($id: String!) {
    allPagesJson(filter: { id: { eq: $id } }) {
      nodes {
        id
        content
        layout
        slug
        title
        next {
          title
          link
        }
        previous {
          title
          link
        }
      }
    }
  }
`;
