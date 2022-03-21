/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Trans, withTranslation } from 'gatsby-plugin-react-i18next';
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
    const reviewify = {
      qaReview: true,
      disabled: true,
      autoplay: false,
    };
    widgets.forEach(widget => {
      const nw = [];
      const { widgets: nestedWidgets, options } = widget || {};
      if (nestedWidgets) {
        nestedWidgets.forEach((nWidget, nIndex) => {
          const { options: nOptions } = nWidget || {};
          const { qaReview: nQaReview } = nOptions || {};
          if (nQaReview !== false) {
            widget.widgets[nIndex].options = {
              ...widget.widgets[nIndex].options,
              ...reviewify,
            };
            nw.push(nWidget);
          }
        });
        widget.widgets = nw;
      }
      const { qaReview } = options || {};
      if (qaReview !== false) {
        widget.options = {
          ...widget.options,
          ...reviewify,
        };

        rw.push(widget);
      }
    });

    return rw;
  }

  getOrderedPages = (pages, id, investigation) =>
    filter(pages, ['investigation', id || investigation]);

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
    const { pageContext, t } = this.props;
    const { investigations } = pageContext;
    const { envInvestigation, pages } = this.state;

    return (
      <div>
        {envInvestigation ? (
          <>
            <h2 className="space-bottom heading-primary dont-print">
              <Trans values={{ investigation: envInvestigation.title }}>
                interface::qa_review.welcome
              </Trans>
            </h2>
            <Card className={`dont-print ${qaReviewCard}`}>
              <TextField
                id="name-input"
                type="text"
                label={t('interface::formfields.name.label')}
                defaultValue={name}
                placeholder={t('interface::formfields.name.placeholder')}
                onChange={this.handleName}
              />
            </Card>
            <br />
            <br />
            <br />
            <h3 className="space-bottom">
              <div className="space-bottom">
                <Trans values={{ investigation: envInvestigation.title }}>
                  interface::qa_review.subtitle
                </Trans>
              </div>
              <div>
                <Trans values={{ investigation: name }}>
                  interface::qa_review.name
                </Trans>
              </div>
              <div className="print-only">
                <Trans
                  values={{
                    val: new Date(),
                    formatParams: {
                      val: {
                        weekday: 'short',
                        month: 'short',
                        year: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        timeZoneName: 'short',
                      },
                    },
                  }}
                >
                  interface::qa_review.date
                </Trans>
              </div>
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
                        const { options, type, widgets: nestedWidgets } =
                          widget || {};
                        const { qaReview } = options || {};
                        const doNotRenderNestedWidgets =
                          nestedWidgets && nestedWidgets.length === 0;

                        if (!qaReview || doNotRenderNestedWidgets) {
                          return null;
                        }

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
                  <Trans>interface::actions.print_answers</Trans>
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
                  <Trans values={{ investigation: title }}>
                    interface::landing.go_to_investigation
                  </Trans>
                </Link>
              </div>
            );
          })
        )}
      </div>
    );
  }
}

export default withTranslation()(QAReviewContainer);

QAReviewContainer.propTypes = {
  pageContext: PropTypes.object,
  data: PropTypes.object,
  t: PropTypes.func,
};

export const query = graphql`
  query QAReviewQuery($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    allPagesJson(sort: { fields: [sectionId, order], order: [ASC, ASC] }) {
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
