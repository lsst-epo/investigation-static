import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Page from '../components/page';
import TwoCol from '../components/page/TwoCol.jsx';
import PageNav from '../components/pageNav';
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
    const { id } = data.allPagesJson.nodes[0];

    this.dispatch.updatePageId(id);
  }

  render() {
    const { data } = this.props;
    const {
      id,
      title,
      layout,
      previous,
      next,
      content,
      questionsByPage: questions,
    } = data.allPagesJson.nodes[0];
    const Tag = this.layouts[layout || 'single-col'];

    return (
      <div className="container-page">
        <Tag
          id={id}
          title={title}
          previous={previous}
          next={next}
          content={content}
          questions={questions}
        />
        <PageNav previous={previous} next={next} />
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
        questionsByPage {
          question {
            id
            questionType
            compoundQuestion
            tool
            label
            labelPre
            labelPost
            srLabel
            answerPre
            answerPost
            answerAccessor
            placeholder
            options {
              label
              value
            }
          }
        }
      }
    }
  }
`;
