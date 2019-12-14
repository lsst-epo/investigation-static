import React from 'react';
import PropTypes from 'prop-types';
import GlobalStore from '../state/GlobalStore';
// import '../assets/stylesheets/styles.scss';
import styles from './layout.module.scss';
import Header from '../components/site/header';
import TableOfContents from '../components/site/tableOfContents';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props;

    const store = new GlobalStore(this.getInvestigationId(data));

    store.addCallbacks();
    store.addReducers();

    this.state = {
      openSidebar: false,
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

  toggleSidebar = () => {
    const { openSidebar } = this.state;
    this.setState(prevState => ({
      ...prevState,
      openSidebar: !openSidebar,
    }));
  };

  render() {
    const { openSidebar } = this.state;
    const { children } = this.props;
    return (
      <>
        <Header
          siteTitle="Investigation"
          sidebarVisiblity={openSidebar}
          toggleSidebar={this.toggleSidebar}
        />
        <TableOfContents
          visible={openSidebar}
          toggleSidebar={this.toggleSidebar}
        />
        <div>
          <main className={styles.container}>{children}</main>
        </div>
        {/* <Footer /> */}
      </>
    );
  }
}

export default Layout;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.object,
};
