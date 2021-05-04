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

    this.state = {
      questions: null,
    };
  }

  componentDidMount() {
    const { data } = this.props;
    const { id, questionsByPage: questions } = data.allPagesJson.nodes[0];
    const { questionNumbersByPage } = this.global || {};
    const questionNumbers = questionNumbersByPage[id];

    this.setState(prevState => ({
      ...prevState,
      questions: this.getQuestionsWithNumbers(questionNumbers, questions),
    }));

    this.dispatch.updatePageId(id);
  }

  allQuestionsAnswered = questions => {
    const { answers } = this.props;
    if (!questions) return true;

    for (let i = 0; i < questions.length; i += 1) {
      const { question } = questions[i];
      if (question[0].compoundQuestion) {
        for (let j = 0; j < question.length; j += 1) {
          const { id: qId } = question[j];
          const answer = answers[qId];

          if (!answer) return false;
        }
      } else {
        const { id: qId } = question[0];
        const answer = answers[qId];

        if (!answer) return false;
      }
    }

    return true;
  };

  getContents(content, contents) {
    if (content && contents) return [{ content }, ...contents];
    if (content) return [{ content, layout: { row: 'middle', col: 'left' } }];
    return contents;
  }

  getQuestionsWithNumbers = (questionNumbers, questions) => {
    if (!questions || !questionNumbers) return [];

    questions.forEach((question, index) => {
      question.number = questionNumbers[index];
    });

    return questions;
  };

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

    const { questions } = this.state;

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
      checkpoints,
      images,
      tables,
      questionsByPage,
    } = data.allPagesJson.nodes[0];
    const { env } = pageContext || {};
    const Tag = this.layouts[layout || 'default'];

    const shared = {
      updateAnswer,
      activeAnswer,
      advanceActiveQuestion,
      setActiveQuestion,
      activeQuestionId,
      questionsByPage,
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
            checkpoints,
            tables,
            images,
            answers,
            shared,
            questions,
          }}
        />
        <PageNav
          {...{ previous, next }}
          baseUrl={!env || env === 'all' ? `/${investigation}` : ''}
          allQuestionsAnswered={this.allQuestionsAnswered(questions)}
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
        checkpoints {
          ...Checkpoint
        }
        questionsByPage {
          ...Question
        }
      }
    }
  }
`;
