/* eslint-disable react/jsx-handler-names */
import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import find from 'lodash/find';
import filter from 'lodash/filter';
import ObservationsTable from '../components/charts/shared/observationsTables/ObservationsTable';
import Widget from '../components/widgets/index';
import QAs from '../components/qas';
import Button from '../components/site/button/index.js';
import {
  qaReviewPageContainer,
  qaReviewTableContainer,
  qaReviewWidgetContainer,
} from '../components/qas/styles.module.scss';

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

    this.setState(prevState => ({
      ...prevState,
      pages: this.reviewifyPages(
        this.getOrderedPages(data.allPagesJson.nodes, id, investigation)
      ),
    }));

    this.dispatch.updatePageId(null);
  }

  reviewifyQuestion(question, questionNumbers, pageId, qIndex) {
    question.number = questionNumbers[qIndex];
    question.question.forEach(q => {
      q.qaReview = true;
    });

    return question;
  }

  reviewifyQuestions(questionsByPage, pageId) {
    const { questionNumbersByPage } = this.global || {};
    const questionNumbers = questionNumbersByPage[pageId];

    return questionsByPage.map((qWrapper, index) => {
      return this.reviewifyQuestion(qWrapper, questionNumbers, pageId, index);
    });
  }

  reviewifyTables(tables) {
    return tables.map(table => {
      table.qaReview = true;

      return table;
    });
  }

  reviewifyWidgets(widgets) {
    return widgets.map(widget => {
      widget.options = {
        ...widget.options,
        qaReview: true,
        disabled: true,
        autoplay: false,
      };

      return widget;
    });
  }

  getOrderedPages(pages, id, investigation) {
    return filter(pages, ['investigation', id || investigation]).sort(
      (a, b) => a.order - b.order
    );
  }

  reviewifyPages(pages) {
    return pages.map(page => {
      if (page.questionsByPage) {
        page.questionsByPage = this.reviewifyQuestions(
          page.questionsByPage,
          page.id
        );
      }

      if (page.tables) {
        page.tables = this.reviewifyTables(page.tables);
      }

      if (page.widgets) {
        page.widgets = this.reviewifyWidgets(page.widgets);
      }

      return page;
    });
  }

  render() {
    const { answers } = this.global;
    const { pageContext } = this.props;
    const { investigations, env, investigation: invId } = pageContext;
    const { envInvestigation, pages } = this.state;

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
                const { questionsByPage: questions, tables, widgets } = page;
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
                  <span
                    key={`page-${page.id}`}
                    className={qaReviewPageContainer}
                  >
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
                    {widgets &&
                      widgets.map(widget => {
                        const { options, type } = widget || {};
                        return (
                          <div
                            key={`widget-${widget.type}`}
                            className={qaReviewWidgetContainer}
                          >
                            <Widget {...{ widget, options, type, ...shared }} />
                          </div>
                        );
                      })}
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
