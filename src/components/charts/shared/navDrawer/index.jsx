import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavigationDrawer } from 'react-md';
import NavDrawerToolbar from './toolbar/index.jsx';

import { navDrawerContainer } from './nav-drawer.module.scss';

class NavDrawer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      menuIsOpen: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { navItems: prevNavItems } = prevProps;
    const { navItems } = this.props;

    if (navItems !== prevNavItems) {
      this.handleMenuClose();
    }
  }

  handleMenuOpen = () => {
    const { menuOpenCallback } = this.props;

    this.setState(
      prevState => ({
        ...prevState,
        menuIsOpen: true,
      }),
      menuOpenCallback
    );
  };

  handleMenuClose = () => {
    const { menuCloseCallback } = this.props;

    this.setState(
      prevState => ({
        ...prevState,
        menuIsOpen: false,
      }),
      menuCloseCallback
    );
  };

  handleVisibilityChange = menuIsOpen => {
    this.setState(prevState => ({
      ...prevState,
      menuIsOpen,
    }));
  };

  render() {
    const {
      navItems,
      classes,
      contentClasses,
      drawerClasses,
      children,
      toolbarTitle,
      toolbarActions,
    } = this.props;
    const { menuIsOpen } = this.state;

    const navClasses = classnames(navDrawerContainer, classes);

    return (
      <>
        <NavDrawerToolbar
          menuIsOpen={menuIsOpen}
          onMenuOpen={this.handleMenuOpen}
          onMenuClose={this.handleMenuClose}
          title={toolbarTitle}
          actions={toolbarActions}
        />
        <NavigationDrawer
          navItems={navItems}
          visible={menuIsOpen}
          onVisibilityChange={this.handleVisibilityChange}
          position="left"
          className={navClasses}
          drawerClassName={drawerClasses}
          mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
          tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
          desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
          overlay={false}
          contentClassName={contentClasses}
        >
          {children}
        </NavigationDrawer>
      </>
    );
  }
}

NavDrawer.propTypes = {
  navItems: PropTypes.array,
  children: PropTypes.node,
  classes: PropTypes.string,
  contentClasses: PropTypes.string,
  drawerClasses: PropTypes.string,
  toolbarTitle: PropTypes.string,
  menuOpenCallback: PropTypes.func,
  menuCloseCallback: PropTypes.func,
  toolbarActions: PropTypes.node,
};

export default NavDrawer;
