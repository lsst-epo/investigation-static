import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbar from 'react-md/lib/Toolbars/Toolbar';
import logo from '../../../images/lsst-logo.svg';
import styles from './header.module.scss';

const Header = ({ siteTitle }) => (
  <Toolbar
    colored
    fixed
    title="LSST"
    titleClassName="screen-reader-only"
    className="header-primary"
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
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
