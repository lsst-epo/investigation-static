import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import flattenDeep from 'lodash/flattenDeep';
import find from 'lodash/find';
import filter from 'lodash/filter';
import GlobalStore from '../state/GlobalStore';
import SEO from '../components/seo';
import Header from '../components/site/header';
import TableOfContents from '../components/site/tableOfContents';
import logo from '../images/rubin-small-logo.svg';

import styles from './layout.module.scss';

@reactn
class Layout extends React.Component {
  constructor(props) {
    super(props);
    const { data: allInvestigationsPages, investigations, pageContext } = props;
    const {
      investigation: investigationId,
      env: envInvestigationId,
    } = pageContext;
    const id = investigationId || envInvestigationId;
    const investigation = find(investigations, { id });

    this.state = {
      tocIsOpen: false,
      investigationTitle: investigation ? investigation.title : '',
      pages: filter(allInvestigationsPages, [
        'investigation',
        id,
      ]).map((page, i) => ({ ...page, pageNumber: i + 1 })),
    };

    this.store = new GlobalStore(this.getInitialGlobals());
    this.store.addCallbacks();
    this.store.addReducers();
  }

  getCheckpoints = () => {
    const { pages } = this.state;

    return pages.reduce((checkpoints, page) => {
      if (page.checkpoints && page.checkpoints.length) {
        checkpoints.push(page.pageNumber);
      }

      return checkpoints;
    }, []);
  };

  getSections = () => {
    const { pages } = this.state;
    const sections = [];

    pages.forEach(page => {
      const { pageNumber } = page;
      let { sectionId } = page;
      sectionId = sectionId || 0;

      if (sections[sectionId]) {
        sections[sectionId].push(pageNumber);
      } else {
        sections[sectionId] = [pageNumber];
      }
    });

    return sections;
  };

  getTotalQAs() {
    const { pages } = this.state;
    let total = 0;

    pages.forEach(page => {
      const { questionsByPage } = page;
      total += questionsByPage ? questionsByPage.length : 0;
    });

    return { questions: total, answers: 0 };
  }

  getTotalPages() {
    const { pages } = this.state;
    return pages.length;
  }

  getQIds(questionsByPage) {
    return flattenDeep(
      questionsByPage.map(q => {
        return q.question.map(nested => {
          return nested.id;
        });
      })
    );
  }

  getQuestionNumbersByPage() {
    const { pages } = this.state;
    const qsByPage = {};
    let qNum = 0;

    // eslint-disable-next-line consistent-return
    pages.forEach(page => {
      const { questionsByPage: questions, id } = page;

      if (questions) {
        qsByPage[id] = questions.map(() => {
          qNum += 1;

          return qNum;
        });
      } else {
        qsByPage[id] = [];
      }
    });

    return qsByPage;
  }

  getTotalQAsByPage() {
    const { pages } = this.state;
    const total = {};

    pages.forEach(page => {
      const { questionsByPage, id } = page;

      const qIds = questionsByPage ? this.getQIds(questionsByPage) : [];

      total[id] = {
        questions: qIds,
        answers: [],
        progress: 0,
      };
    });

    return total;
  }

  getInitialGlobals() {
    const { pageContext } = this.props;
    const { investigation, env: envInvestigation } = pageContext || {};

    return {
      educatorMode: false,
      investigation: investigation || envInvestigation,
      totalPages: this.getTotalPages(),
      totalQAsByInvestigation: this.getTotalQAs(),
      totalQAsByPage: this.getTotalQAsByPage(),
      questionNumbersByPage: this.getQuestionNumbersByPage(),
      checkpoints: this.getCheckpoints(),
      sections: this.getSections(),
    };
  }

  toggleToc = () => {
    const { tocIsOpen } = this.state;
    this.setState(prevState => ({
      ...prevState,
      tocIsOpen: !tocIsOpen,
    }));
  };

  getCurrentPageNumber(pages, pageId) {
    const { pageNumber } = find(pages, { id: pageId }) || {};
    return pageNumber;
  }

  render() {
    const { pageId, sections, totalPages } = this.global;
    const { tocIsOpen, pages, investigationTitle } = this.state;
    const { children, pageContext } = this.props;
    const { investigation: contextInvestigation, env: envInvestigation } =
      pageContext || {};
    const investigation = contextInvestigation || envInvestigation;

    return (
      <>
        <SEO title={investigationTitle || investigation || 'Investigation'} />
        <Header
          logo={investigation !== 'ngss-solar-system' ? logo : null}
          pageNumber={this.getCurrentPageNumber(pages, pageId)}
          tocVisability={tocIsOpen}
          toggleToc={investigation && this.toggleToc}
          {...{ sections, investigationTitle, totalPages }}
        />
        {investigation && (
          <TableOfContents
            visible={tocIsOpen}
            toggleToc={this.toggleToc}
            investigation={investigation}
            isAll={!envInvestigation || envInvestigation === 'all'}
            pages={pages}
          />
        )}
        <main className={styles.container}>{children}</main>
      </>
    );
  }
}

export default props => (
  <StaticQuery
    query={graphql`
      query MyQuery {
        allPagesJson(sort: { fields: [sectionId, order], order: [ASC, ASC] }) {
          nodes {
            title
            slug
            id
            investigation
            order
            sectionId
            layout
            questionsByPage {
              question {
                id
              }
            }
            checkpoints {
              ...Checkpoint
            }
          }
        }
        allInvestigationsJson {
          nodes {
            id
            title
          }
        }
      }
    `}
    render={data => (
      <Layout
        {...props}
        data={data.allPagesJson.nodes}
        investigations={data.allInvestigationsJson.nodes}
      />
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  pageContext: PropTypes.object,
  data: PropTypes.array,
  investigations: PropTypes.array,
};
