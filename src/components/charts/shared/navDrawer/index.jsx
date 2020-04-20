import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Card, NavigationDrawer } from 'react-md';
import NavDrawerToolbar from './toolbar/index.jsx';

import { navDrawerContainer, drawerCard } from './nav-drawer.module.scss';

class NavDrawer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      menuIsOpen: false,
    };
  }

  menuToggler = menuIsOpen => {
    const { menuOpenCallback, menuCloseCallback } = this.props;

    this.setState(
      prevState => ({
        ...prevState,
        menuIsOpen,
      }),
      menuIsOpen ? menuOpenCallback : menuCloseCallback
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
      interactableToolbar,
      showNavDrawer,
      cardClasses,
      toolbarStyles,
    } = this.props;
    const { menuIsOpen } = this.state;

    const navClasses = classnames(navDrawerContainer, classes);
    const cardContainerClasses = classnames(drawerCard, cardClasses);

    return (
      <>
        {showNavDrawer && (
          <Card className={cardContainerClasses}>
            <NavDrawerToolbar
              menuIsOpen={menuIsOpen}
              toggleMenu={this.menuToggler}
              title={toolbarTitle}
              actions={toolbarActions}
              interactableToolbar={interactableToolbar}
              toolbarStyles={toolbarStyles}
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
          </Card>
        )}

        {!showNavDrawer && children}
      </>
    );
  }
}

NavDrawer.defaultProps = {
  showNavDrawer: true,
};

NavDrawer.propTypes = {
  navItems: PropTypes.array,
  children: PropTypes.node,
  classes: PropTypes.string,
  cardClasses: PropTypes.string,
  contentClasses: PropTypes.string,
  drawerClasses: PropTypes.string,
  toolbarTitle: PropTypes.string,
  menuOpenCallback: PropTypes.func,
  menuCloseCallback: PropTypes.func,
  toolbarActions: PropTypes.node,
  interactableToolbar: PropTypes.bool,
  showNavDrawer: PropTypes.bool,
  toolbarStyles: PropTypes.object,
};

export default NavDrawer;
