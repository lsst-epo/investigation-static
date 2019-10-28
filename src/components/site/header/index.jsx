import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbar from 'react-md/lib/Toolbars/Toolbar';
import logo from '../../../images/lsst-logo.svg';

const Header = ({ siteTitle }) => (
  <Toolbar
    colored
    fixed
    title="LSST"
    titleClassName="screen-reader-only"
    className="header-primary"
  >
    <Link to="/" className="logo-wrapper">
      <span className="screen-reader-only">Home</span>
      <img aria-hidden src={logo} alt={siteTitle} className="site-logo" />
    </Link>
    {/* <LinearProgress className="page-progress" value={pageProgress} /> */}
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
