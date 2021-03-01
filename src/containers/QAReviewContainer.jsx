/* eslint-disable react/jsx-handler-names */
import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import find from 'lodash/find';
import filter from 'lodash/filter';
import flattenDeep from 'lodash/flattenDeep';
import QAs from '../components/qas';
import Button from '../components/site/button/index.js';

@reactn
class QAReviewContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    const { pageContext } = props;
    const { env: id, investigations, investigation } = pageContext;

    this.state = {
      envInvestigation:
        find(investigations, { id: id || investigation }) || null,
      questions: null,
      answers: null,
    };
  }

  componentDidMount() {
    const { pageContext, data } = this.props;
    const { env: id, investigation } = pageContext;
    const { answers } = this.global;

    const filteredQuestions = filter(data.allPagesJson.nodes, [
      'investigation',
      id || investigation,
    ]);

    const questions = flattenDeep(
      filteredQuestions
        .filter(fq => !!fq.questionsByPage)
        .map(fq => {
          return fq.questionsByPage.map(qbp => {
            qbp.question.map(q => {
              q.qaReview = true;
              return q;
            });
            return qbp;
          });
        })
    );

    this.setState(prevState => ({
      ...prevState,
      data,
      questions,
      answers,
    }));

    this.dispatch.updatePageId(null);
  }

  render() {
    const { pageContext } = this.props;
    const { investigations, env, investigation: invId } = pageContext;
    const { envInvestigation, questions, answers } = this.state;

    const shared = {
      questions,
      answers,
      updateAnswer: () => {},
      activeAnswer: {},
      advanceActiveQuestion: () => {},
      setActiveQuestion: () => {},
      activeQuestionId: '',
    };

    return (
      <>
        <h2 className="space-bottom heading-primary">
          Great job! Let&apos;s review your answers for the{' '}
          {envInvestigation.title} investigation.
        </h2>

        {envInvestigation ? (
          <>
            {questions && <QAs {...shared} />}
            <div className="container-flex spaced">
              <div className="col">
                <Button
                  flat
                  secondary
                  swapTheming
                  to={`${!env ? invId : ''}/last-page/`}
                  component={Link}
                >
                  All Done Reviewing
                </Button>
              </div>
            </div>
          </>
        ) : (
          investigations.map(investigation => {
            const { id, title } = investigation;
            return (
              <div key={id}>
                <Link to={`/${id}/introduction/`}>
                  Go to {title} Investigation
                </Link>
              </div>
            );
          })
        )}
      </>
    );
  }
}

export default QAReviewContainer;

QAReviewContainer.propTypes = {
  pageContext: PropTypes.object,
  data: PropTypes.object,
};

export const query = graphql`
  query QAReviewQuery {
    allPagesJson {
      nodes {
        investigation
        questionsByPage {
          question {
            id
            label
            labelPost
            labelPre
            questionType
            placeholder
            compoundQuestion
            answerAccessor
            answerPost
            answerPre
            tool
            title
            srLabel
            required
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
