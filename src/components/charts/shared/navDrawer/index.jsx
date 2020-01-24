import React from 'react';
import PropTypes from 'prop-types';
import { NavigationDrawer } from 'react-md';
import classnames from 'classnames';

import { navDrawerContainer } from './nav-drawer.module.scss';

class NavDrawer extends React.PureComponent {
  render() {
    const {
      navItems,
      visible,
      onVisibilityChange,
      classes,
      contentClasses,
      drawerClasses,
      children,
    } = this.props;

    const navClasses = classnames(navDrawerContainer, classes);

    return (
      <NavigationDrawer
        {...{ navItems, visible, onVisibilityChange }}
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
    );
  }
}

NavDrawer.propTypes = {
  navItems: PropTypes.array,
  visible: PropTypes.bool,
  onVisibilityChange: PropTypes.func,
  children: PropTypes.node,
  classes: PropTypes.string,
  contentClasses: PropTypes.string,
  drawerClasses: PropTypes.string,
};

export default NavDrawer;
