import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { Toolbar } from 'react-md';
import Button from '../button/index';
import logo from '../../../images/lsst-logo.svg';
import ButtonIcon from '../button/ButtonIcon';
import Close from '../icons/Close';
import Menu from '../icons/Menu';

import styles from './header.module.scss';

class Header extends React.PureComponent {
  render() {
    const { siteTitle, toggleSidebar, sidebarVisiblity } = this.props;

    return (
      <>
        <Toolbar
          colored
          fixed
          title="LSST"
          titleClassName="screen-reader-only"
          className="header-primary"
          nav={
            <Button
              icon
              iconEl={
                sidebarVisiblity ? (
                  <ButtonIcon srText="Close Table of Contents" Icon={Close} />
                ) : (
                  <ButtonIcon srText="Open Table of Contents" Icon={Menu} />
                )
              }
              onClick={toggleSidebar}
            />
          }
        >
          <div className={styles.headerInner}>
            <Link to="/" className={styles.logoWrapper}>
              <span className="screen-reader-only">Home</span>
              <img
                aria-hidden
                src={logo}
                alt={siteTitle}
                className={styles.siteLogo}
              />
            </Link>
          </div>
          {/* <LinearProgress className="{styles.pageProgress} value={pageProgress} /> */}
          {/*        <SiteNav
            menuOpen={menuOpen}
            handleClose={this.closeMenu}
            handleClick={this.clickHandler}
          /> */}
        </Toolbar>
      </>
    );
  }
}

Header.propTypes = {
  siteTitle: PropTypes.string,
  sidebarVisiblity: PropTypes.bool,
  toggleSidebar: PropTypes.func,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
