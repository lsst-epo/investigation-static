import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import includes from 'lodash/includes';
import isObject from 'lodash/isObject';
import { qById, getActiveQ } from './utilities.js';
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

    this.state = {
      questions: null,
      activeId: null,
      activeQuestion: null,
    };
  }

  componentDidMount() {
    const { data } = this.props;
    const { answers } = this.global;
    const { id, questionsByPage: questions } = data.allPagesJson.nodes[0];
    const activeQuestion = getActiveQ(questions, answers);

    this.setState(prevState => ({
      ...prevState,
      questions,
      activeId: activeQuestion ? activeQuestion.id : null,
      activeQuestion,
    }));

    this.dispatch.updatePageId(id);
  }

  // Methods related to setting & updating "active QA"

  // Callback method passed down to child components
  setActiveQuestion = activeId => {
    const { questions } = this.state;
    const activeQ = qById(questions, activeId);
    this.setState(prevState => ({
      ...prevState,
      activeQ,
      activeId,
    }));
  };

  // Callback method passed down to child components
  advanceActiveQuestion = () => {
    const { questions } = this.state;
    const { answers } = this.global;
    const activeQ = getActiveQ(questions, answers);

    this.setState(prevState => ({
      ...prevState,
      activeQ,
      activeId: activeQ ? activeQ.id : null,
    }));
  };

  // Methods related to updating answers

  updateAnswer(id, data) {
    const { questions } = this.state;
    const answeredQuestion = qById(questions, id);
    const { answerAccessor } = answeredQuestion;
    let content = data;

    if (answerAccessor === 'text') {
      content = data || '';
      content = isObject(content) ? '' : content;
    } else if (
      answerAccessor === 'compound-select' ||
      answerAccessor === 'select'
    ) {
      content = data;
      content = isObject(content) ? 'DEFAULT' : content;
    } else if (answerAccessor === 'count') {
      content = data.length;
    } else if (!includes(answerAccessor, 'range')) {
      content = data[0] ? data[0][answerAccessor] : 'None Selected';
    }

    this.dispatch.updateAnswer(id, content, data);
  }

  // Callback method passed down to child components
  answerHandler = (id, data, eventType) => {
    if ((id && data) || eventType) {
      this.updateAnswer(id, data);
    } else {
      this.dispatch.clearAnswer(id);
    }
  };

  render() {
    const { data } = this.props;
    const { questions, activeId } = this.state;
    const {
      id,
      title,
      layout,
      previous,
      next,
      content,
    } = data.allPagesJson.nodes[0];
    const { answers } = this.global;
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
          answers={answers}
          activeId={activeId}
          answerHandler={this.answerHandler}
          advanceActive={this.advanceActiveQuestion}
          setActive={this.setActiveQuestion}
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
