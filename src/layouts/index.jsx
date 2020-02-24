import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import flattenDeep from 'lodash/flattenDeep';
import filter from 'lodash/filter';
import GlobalStore from '../state/GlobalStore';
import SEO from '../components/seo';
import Header from '../components/site/header';
import TableOfContents from '../components/site/tableOfContents';
// import LandingPage from '../components/site/LandingPage.jsx';
import logo from '../images/lsst-logo.svg';

import styles from './layout.module.scss';

@reactn
class Layout extends React.Component {
  constructor(props) {
    super(props);
    const { data: allInvestigationsPages, pageContext } = props;
    const { investigation } = pageContext;

    this.state = {
      tocIsOpen: false,
      pages: filter(allInvestigationsPages, ['investigation', investigation]),
    };

    // console.log('constructor', this.state.investigation, this.props.pageContext.investigation);
    this.store = new GlobalStore(this.getInitialGlobals());
    this.store.addCallbacks();
    this.store.addReducers();
  }

  componentDidUpdate(prevProps) {
    const { pageContext: prevPageContext } = prevProps;
    const { investigation: prevInvestigation } = prevPageContext || {};
    const { pageContext } = this.props;
    const { investigation } = pageContext || {};

    if (prevInvestigation !== (investigation && investigation !== undefined)) {
      // this.store.dispatch.updateGlobalFromIvestigation(investigation);
      // console.log(this.global);
    }
    // console.log('update', this.state.investigation, this.props.pageContext.investigation);
  }

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
    const { investigation } = pageContext || {};

    return {
      investigation,
      totalPages: this.getTotalPages(),
      totalQAsByInvestigation: this.getTotalQAs(),
      totalQAsByPage: this.getTotalQAsByPage(),
    };
  }

  toggleToc = () => {
    const { tocIsOpen } = this.state;
    this.setState(prevState => ({
      ...prevState,
      tocIsOpen: !tocIsOpen,
    }));
  };

  render() {
    const { tocIsOpen, pages } = this.state;
    const { children, pageContext } = this.props;
    const { investigation, env } = pageContext || {};

    return (
      <>
        <SEO title={investigation || 'Investigation'} />
        <Header
          siteTitle="Investigation"
          tocVisability={tocIsOpen}
          toggleToc={investigation && this.toggleToc}
          logo={logo}
        />
        {investigation && (
          <TableOfContents
            visible={tocIsOpen}
            toggleToc={this.toggleToc}
            investigation={investigation}
            isAll={!env || env === 'all'}
            navLinks={pages}
          />
        )}
        <div>
          <main className={styles.container}>{children}</main>
        </div>
      </>
    );
  }
}

export default props => (
  <StaticQuery
    query={graphql`
      query MyQuery {
        allPagesJson(sort: { fields: order, order: ASC }) {
          nodes {
            title
            slug
            id
            investigation
            order
            questionsByPage {
              question {
                id
              }
            }
          }
        }
      }
    `}
    render={data => <Layout {...props} data={data.allPagesJson.nodes} />}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  pageContext: PropTypes.object,
  data: PropTypes.array,
};
