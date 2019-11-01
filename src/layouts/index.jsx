import React from 'react';
import PropTypes from 'prop-types';
import GlobalStore from '../state/GlobalStore';
// import '../assets/stylesheets/styles.scss';
import styles from './layout.module.scss';
import Header from '../components/site/header';
import TableOfContents from '../components/site/tableOfContents';
// import Footer from '../components/site/footer';

class Layout extends React.Component {
  constructor() {
    super();

    const store = new GlobalStore();

    store.addCallbacks();
    store.addReducers();

    this.state = {
      openSidebar: false,
    };
  }

  toggleSidebar = () => {
    const { openSidebar } = this.state;
    this.setState({ openSidebar: !openSidebar });
  };

  render() {
    const { openSidebar } = this.state;
    const { children } = this.props;
    return (
      <div style={{ minHeight: '100vh' }}>
        <Header siteTitle="Investigation" toggleSidebar={this.toggleSidebar} />
        <TableOfContents openSidebar={openSidebar} />
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
  // data: PropTypes.object,
};
