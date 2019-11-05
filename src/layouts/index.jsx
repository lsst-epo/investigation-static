import React from 'react';
import PropTypes from 'prop-types';
import GlobalStore from '../state/GlobalStore';
// import '../assets/stylesheets/styles.scss';
import styles from './layout.module.scss';
import Header from '../components/site/header';
import TableOfContents from '../components/site/tableOfContents';
// import Footer from '../components/site/footer';
const TO_PREFIX = '/';
const routes = [
  {
    label: 'home',
    to: `${TO_PREFIX}`,
    icon: 'home',
    exact: 'true',
    primaryText: 'Home',
  },
  {
    label: 'style-guide',
    to: `${TO_PREFIX}StyleGuide`,
    icon: 'style',
    primaryText: 'Style Guide',
  },
  { divider: true },
  {
    primaryText: 'Table of Contents',
    subheader: true,
  },
];
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

  navItems = routes.map(route => {
    return route;
  });

  toggleSidebar = toggleView => {
    const { openSidebar } = this.state;
    this.setState({ openSidebar: toggleView || !openSidebar });
  };

  render() {
    const { openSidebar } = this.state;
    const { children } = this.props;
    return (
      <>
        <Header siteTitle="Investigation" toggleSidebar={this.toggleSidebar} />
        <TableOfContents
          tocLinks={this.navItems}
          openSidebar={openSidebar}
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
  // data: PropTypes.object,
};
