import { graphql } from 'gatsby';

export const questionFragment = graphql`
  fragment Question on PagesJsonQuestionsByPage {
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
      showUserAnswer
      options {
        label
        value
      }
      qaReview
    }
  }
`;
