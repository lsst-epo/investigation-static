import React from 'react';
import PropTypes from 'prop-types';
import { NavigationDrawer } from 'react-md';
import GlobalStore from '../state/GlobalStore';
// import '../assets/stylesheets/styles.scss';
import styles from './layout.module.scss';
import Header from '../components/site/header';
// import TableOfContents from '../components/site/tableOfContents';
// import Footer from '../components/site/footer';
const routes = [
  {
    to: '',
    exact: 'true',
    icon: 'home',
  },
  {
    to: 'testing',
    icon: 'list',
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

  toggleSidebar = () => {
    const { openSidebar } = this.state;
    this.setState({ openSidebar: !openSidebar });
  };

  render() {
    // const { openSidebar } = this.state;
    const { children } = this.props;
    return (
      <NavigationDrawer
        drawerId="main-table-of-contents"
        drawerTitle="Table of Contents"
        navItems={this.navItems}
      >
        <Header siteTitle="Investigation" toggleSidebar={this.toggleSidebar} />
        <div>
          <main className={styles.container}>{children}</main>
        </div>
        {/* <Footer /> */}
      </NavigationDrawer>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
