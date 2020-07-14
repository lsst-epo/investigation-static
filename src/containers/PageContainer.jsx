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

  shouldDisable = questions => {
    const { answers } = this.props;
    if (!questions) return false;

    for (let i = 0; i < questions.length; i += 1) {
      const { id: qId, required } = questions[i].question[0];
      const answer = answers[qId];

      if (required && !answer) return true;
    }

    return false;
  };

  getContents(content, contents) {
    if (content && contents) return [{ content }, ...contents];
    if (content) return [{ content, layout: { row: 'middle', col: 'left' } }];
    return contents;
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
      contents,
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
          contents={this.getContents(content, contents)}
          {...{
            id,
            layout,
            title,
            previous,
            next,
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
          baseUrl={!env || env === 'all' ? `/${investigation}` : ''}
          disableButton={this.shouldDisable(questions)}
        />
      </div>
    );
  }
}

export default WithQAing(PageContainer);

PageContainer.propTypes = {
  pageContext: PropTypes.object,
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
        ...PageMeta
        contents {
          ...Content
        }
        images {
          ...Image
        }
        tables {
          ...Table
        }
        widgets {
          ...Widget
        }
        questionsByPage {
          ...Question
        }
      }
    }
  }
`;
