/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import find from 'lodash/find';
import filter from 'lodash/filter';
import Card from '../components/site/card';
import TextField from '../components/site/forms/textField';
import ObservationsTable from '../components/charts/shared/observationsTables/ObservationsTable';
import Widget from '../components/widgets/index';
import QAs from '../components/qas';
import Button from '../components/site/button/index.js';
import {
  qaReviewQuestionsContainer,
  qaReviewTableContainer,
  qaReviewWidgetContainer,
  qaReviewCard,
  qaReviewPage,
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
      const { qaReview } = q;
      q.qaReview = qaReview !== null ? qaReview : true;
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
    const rt = [];

    tables.forEach(table => {
      const { qaReview } = table;

      if (qaReview !== false) {
        table.qaReview = true;
        rt.push(table);
      }
    });

    return rt;
  }

  reviewifyWidgets(widgets) {
    const rw = [];
    widgets.forEach(widget => {
      const { options } = widget || {};
      const { qaReview } = options || {};
      if (qaReview !== false) {
        widget.options = {
          ...widget.options,
          qaReview: true,
          disabled: true,
          autoplay: false,
        };

        rw.push(widget);
      }
    });

    return rw;
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

  handleName = name => {
    this.dispatch.updateName(name);
  };

  handlePrint = () => {
    window.print();
  };

  render() {
    const { answers, name } = this.global;
    const { pageContext } = this.props;
    const { investigations } = pageContext;
    const { envInvestigation, pages } = this.state;

    return (
      <div>
        {envInvestigation ? (
          <>
            <h2 className="space-bottom heading-primary dont-print">
              Great job! Let&apos;s review your answers for the{' '}
              {envInvestigation.title} Investigation.
            </h2>
            <Card className={`dont-print ${qaReviewCard}`}>
              <TextField
                id="name-input"
                type="text"
                label="Please enter your name"
                defaultValue={name}
                placeholder="Name"
                onChange={this.handleName}
              />
            </Card>
            <br />
            <br />
            <br />
            <h3 className="space-bottom">
              <div className="space-bottom">
                {envInvestigation.title} Investigation: Questions & Answers
              </div>
              <div>Name: {name}</div>
              <div className="print-only">Date: {new Date().toString()}</div>
            </h3>
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
                  <div key={`page-${page.id}`} className={qaReviewPage}>
                    {questions && (
                      <div className={qaReviewQuestionsContainer}>
                        <QAs {...shared} qaReviewPage />
                      </div>
                    )}
                    {questions &&
                      widgets &&
                      widgets.map(widget => {
                        const { options, type } = widget || {};
                        const { qaReview } = options || {};

                        if (!qaReview) return null;

                        return (
                          <div
                            key={`widget-${widget.type}`}
                            className={qaReviewWidgetContainer}
                          >
                            <Widget {...{ widget, options, type, ...shared }} />
                          </div>
                        );
                      })}
                    {questions &&
                      tables &&
                      tables.map((table, tableIndex) => (
                        <div
                          key={`table-id-${table.id}-${tableIndex}`}
                          className={qaReviewTableContainer}
                        >
                          <ObservationsTable {...table} answers={answers} />
                        </div>
                      ))}
                  </div>
                );
              })}
            <div className="container-flex spaced dont-print">
              <div className="col">
                <Button flat secondary swapTheming onClick={this.handlePrint}>
                  Print Your Answers
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
      </div>
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
    allPagesJson(sort: { fields: order, order: ASC }) {
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
