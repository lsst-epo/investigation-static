import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { WithQAing } from './WithQAing';
import SingleCol from '../components/page/SingleCol.jsx';
import TwoCol from '../components/page/TwoCol.jsx';
import PageNav from '../components/pageNav';

@reactn
class PageContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.layouts = {
      default: SingleCol,
      TwoCol,
      SingleCol,
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
      pageContext,
    } = this.props;

    const {
      id,
      investigation,
      title,
      layout,
      previous,
      next,
      content,
      widgets,
      images,
      tables,
      questionsByPage: questions,
    } = data.allPagesJson.nodes[0];
    const { env } = pageContext || {};
    const Tag = this.layouts[layout || 'default'];

    const shared = {
      updateAnswer,
      activeAnswer,
      advanceActiveQuestion,
      setActiveQuestion,
      activeQuestionId,
    };

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
            widgets,
            tables,
            images,
            questions,
            answers,
            shared,
          }}
        />
        <PageNav
          {...{ previous, next }}
          baseUrl={!env || env === 'all' ? `/${investigation}` : '/'}
        />
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
  query PageQuery($id: String!, $investigation: String) {
    allPagesJson(
      filter: { id: { eq: $id }, investigation: { eq: $investigation } }
    ) {
      nodes {
        id
        investigation
        layout
        slug
        title
        content
        next {
          title
          link
        }
        previous {
          title
          link
        }
        images {
          mediaPath
          altText
          layout {
            col
            row
          }
        }
        tables {
          id
          title
          layout {
            col
            row
          }
          colTitles
          rowTitles
          rows {
            accessor
            id
            content
          }
        }
        widgets {
          type
          source
          sources
          layout {
            col
            row
          }
          options {
            title
            show2D
            show3D
            showSelector
            showLightCurve
            showUserPlot
            createUserHubblePlot
            hubbleConstant
            userTrendline
            lightCurveTemplates
            choosePeakMagnitude
            chooseLightCurveTemplate
            preSelectedLightCurveTemplate
            preSelectedLightCurveMagnitude
            toggleDataPointsVisibility
            randomSource
            autoplay
            preSelected
            multiple
            domain
            xAxisLabel
            yAxisLabel
            xValueAccessor
            yValueAccessor
            tooltipAccessors
            tooltipUnits
            tooltipLabels
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
