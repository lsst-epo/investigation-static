import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Toolbar } from 'react-md';
import logo from '../../../images/lsst-logo.svg';
import styles from './header.module.scss';
import TableOfContents from '../tableOfContents';
import Menu from '../icons/Menu';

class Header extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openSidebar: false,
    };
  }

  toggleSidebar = () => {
    const { openSidebar } = this.state;
    this.setState({ openSidebar: !openSidebar });
  };

  render() {
    const { siteTitle } = this.props;
    const { openSidebar } = this.state;

    return (
      <>
        <Toolbar
          colored
          fixed
          title="LSST"
          titleClassName="screen-reader-only"
          className="header-primary"
        >
          <div className={styles.headerInner}>
            <Button
              icon
              iconEl={<Menu />}
              onClick={this.toggleSidebar}
              className={styles.menuIcon}
            />
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
        <TableOfContents openSidebar={openSidebar} />
      </>
    );
  }
}

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
