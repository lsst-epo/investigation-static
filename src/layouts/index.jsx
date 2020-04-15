import React from 'react';
import PropTypes from 'prop-types';
import GlobalStore from '../state/GlobalStore';
// import '../assets/stylesheets/styles.scss';
import SEO from '../components/seo';
import Header from '../components/site/header';
import TableOfContents from '../components/site/tableOfContents';
// import LandingPage from '../components/site/LandingPage.jsx';
import logo from '../images/lsst-logo.svg';

import styles from './layout.module.scss';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props;

    const store = new GlobalStore(this.getInvestigationId(data));

    store.addCallbacks();
    store.addReducers();

    this.state = {
      tocIsOpen: false,
    };
  }

  getInvestigationId(data) {
    let investigationId = 'store';
    if (data && data.allPagesJson) {
      const {
        allPagesJson: { nodes },
      } = data;
      const { investigation } = nodes[0];
      investigationId = investigation || 'store';
    }

    return investigationId;
  }

  toggleToc = () => {
    const { tocIsOpen } = this.state;
    this.setState(prevState => ({
      ...prevState,
      tocIsOpen: !tocIsOpen,
    }));
  };

  render() {
    const { tocIsOpen } = this.state;
    const { children, pageContext } = this.props;
    const { investigation, env } = pageContext;

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
          />
        )}
        <div>
          <main className={styles.container}>{children}</main>
        </div>
      </>
    );
  }
}

export default Layout;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  pageContext: PropTypes.object,
  data: PropTypes.object,
};
