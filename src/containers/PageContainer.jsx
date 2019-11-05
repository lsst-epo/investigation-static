import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import includes from 'lodash/includes';
import isObject from 'lodash/isObject';
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
    const { id, questionsByPage: questions } = data.allPagesJson.nodes[0];
    const activeQuestion = this.getActiveQ(questions);

    this.setState(prevState => ({
      ...prevState,
      questions,
      activeId: activeQuestion ? activeQuestion.id : null,
      activeQuestion,
    }));

    this.dispatch.updatePageId(id);
  }

  // Helper methods related to determining "active QA"
  qWithEmptyA(qArray, answers) {
    return find(qArray, q => {
      return isEmpty(answers[q.id]);
    });
  }

  getActiveQ = questions => {
    const { answers } = this.global;
    const activeQ = find(questions, question => {
      return !!this.qWithEmptyA(question.question, answers);
    });

    if (!activeQ) return null;

    if (activeQ.question.length > 1) {
      const nestedActiveQ = this.qWithEmptyA(activeQ.question, answers);

      return nestedActiveQ || null;
    }

    return activeQ ? activeQ.question[0] : null;
  };

  // Methods related to setting & updating "active QA"

  // Callback method passed down to child components
  setActiveQuestion = activeQ => {
    this.setState(prevState => ({
      ...prevState,
      activeQ,
      activeId: activeQ ? activeQ.id : null,
    }));
  };

  // Callback method passed down to child components
  advanceActiveQuestion = () => {
    const { questions } = this.state;
    const activeQ = this.getActiveQ(questions);
    this.setActiveQuestion(activeQ);
  };

  // Helper methods for identifying question being answered
  qInArrayById(qs, id) {
    const q = find(qs, nestedQ => {
      return nestedQ.id === id;
    });

    return q;
  }

  qById(questions, id) {
    const identifiedQ = find(questions, q => {
      return !!this.qInArrayById(q.question, id);
    });

    if (identifiedQ.question.length > 1) {
      return this.qInArrayById(identifiedQ.question, id);
    }

    return identifiedQ.question[0];
  }

  // Methods related to updating answers

  updateAnswer(id, data) {
    const { questions } = this.state;
    const answeredQuestion = this.qById(questions, id);
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
