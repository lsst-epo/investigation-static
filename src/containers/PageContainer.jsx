import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Page from '../components/page';
import TwoCol from '../components/page/TwoCol.jsx';
import PageNav from '../components/pageNav';
import Placeholder from '../components/placeholder';
import SupernovaSelectorWithLightCurve from './SupernovaSelectorWithLightCurveContainer';

@reactn
class PageContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.layouts = {
      default: Page,
      TwoCol,
      SingleCol: Page,
    };

    this.widgetTags = {
      SupernovaSelectorWithLightCurve,
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
      image,
      widget,
      questionsByPage: questions,
    } = data.allPagesJson.nodes[0];
    const Tag = this.layouts[layout || 'default'];
    const WidgetTag = widget ? this.widgetTags[widget.type] : null;
    const MediaTag = WidgetTag || image || Placeholder;

    return (
      <div className="container-page">
        <Tag
          id={id}
          layout={layout}
          title={title}
          previous={previous}
          next={next}
          content={content}
          widget={widget}
          image={image}
          MediaTag={MediaTag}
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
        widget {
          type
          source
          options {
            showSelector
            showLightCurve
          }
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
