import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { WithQAing } from './WithQAing';
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
    const {
      data,
      answers,
      updateAnswer,
      activeAnswer,
      activeQuestionId,
      advanceActiveQuestion,
      setActiveQuestion,
    } = this.props;
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
    const options = widget ? widget.options : null;
    const Tag = this.layouts[layout || 'default'];
    const WidgetTag = widget ? this.widgetTags[widget.type] : null;
    const MediaTag = WidgetTag || image || Placeholder;

    return (
      <div className="container-page">
        <Tag
          {...{
            id,
            layout,
            title,
            previous,
            next,
            content,
            widget,
            image,
            questions,
            answers,
            updateAnswer,
            activeAnswer,
            advanceActiveQuestion,
            setActiveQuestion,
            activeQuestionId,
            options,
            MediaTag,
          }}
        />
        <PageNav {...{ previous, next }} />
      </div>
    );
  }
}

export default WithQAing(PageContainer);

PageContainer.propTypes = {
  data: PropTypes.object,
  answers: PropTypes.object,
  updateAnswer: PropTypes.func,
  activeAnswer: PropTypes.object,
  activeQuestionId: PropTypes.string,
  advanceActiveQuestion: PropTypes.func,
  setActiveQuestion: PropTypes.func,
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
            lightCurveTemplates
            chooseLightCurveTemplate
            preSelectedLightCurveTemplate
            autoplay
            preSelected
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
