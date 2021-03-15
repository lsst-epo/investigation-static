/* eslint-disable react/jsx-handler-names */
import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import find from 'lodash/find';
import filter from 'lodash/filter';
import flattenDeep from 'lodash/flattenDeep';
import ObservationsTable from '../components/charts/shared/observationsTables/ObservationsTable';
import QAs from '../components/qas';
import Button from '../components/site/button/index.js';
import { qaReviewTableContainer } from '../components/qas/styles.module.scss';

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

    const filteredByInvestigation = filter(data.allPagesJson.nodes, [
      'investigation',
      id || investigation,
    ])
      .sort((a, b) => a.order - b.order)
      .map(inv => {
        if (inv.questionsByPage) {
          inv.questionsByPage = inv.questionsByPage.map(qbp => {
            qbp.question.map(q => {
              q.qaReview = true;
              return q;
            });
            return qbp;
          });
        }
        if (inv.tables) {
          inv.tables = inv.tables.map(table => {
            table.qaReview = true;
            return table;
          });
        }
        return inv;
      });

    const questions = flattenDeep(
      filteredByInvestigation.filter(fq => !!fq.questionsByPage)
    );

    const tables = flattenDeep(
      filteredByInvestigation.filter(inv => !!inv.tables)
    );

    this.setState(prevState => ({
      ...prevState,
      data,
      // questions,
      pages: filteredByInvestigation,
      questions,
      answers,
      tables,
    }));

    this.dispatch.updatePageId(null);
  }

  render() {
    const { pageContext } = this.props;
    const { investigations, env, investigation: invId } = pageContext;
    const { envInvestigation, pages, answers } = this.state;

    return (
      <>
        <h2 className="space-bottom heading-primary">
          Great job! Let&apos;s review your answers for the{' '}
          {envInvestigation.title} investigation.
        </h2>

        {envInvestigation ? (
          <>
            {pages &&
              pages.map(page => {
                const { questionsByPage: questions, tables } = page;
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
                  <span key={`page-${page.id}`}>
                    {questions && <QAs {...shared} />}
                    {tables &&
                      tables.map((table, tableIndex) => (
                        <div
                          // eslint-disable-next-line react/no-array-index-key
                          key={`table-id-${table.id}-${tableIndex}`}
                          className={qaReviewTableContainer}
                        >
                          <ObservationsTable {...table} answers={answers} />
                        </div>
                      ))}
                  </span>
                );
              })}
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
        ...PageMeta
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
