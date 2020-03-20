import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { Toolbar } from 'react-md';
import Button from '../button/index';
import ButtonIcon from '../button/ButtonIcon';
import Close from '../icons/Close';
import Menu from '../icons/Menu';

import styles from './header.module.scss';

class Header extends React.PureComponent {
  render() {
    const { siteTitle, toggleToc, tocVisability, logo } = this.props;

    return (
      <Toolbar
        data-testid="site-header"
        colored
        fixed
        title={siteTitle}
        titleClassName="screen-reader-only"
        className="header-primary"
        nav={
          <Button
            icon
            iconEl={
              tocVisability ? (
                <ButtonIcon srText="Close Table of Contents" Icon={Close} />
              ) : (
                <ButtonIcon srText="Open Table of Contents" Icon={Menu} />
              )
            }
            onClick={toggleToc}
          />
        }
      >
        <div className={styles.headerInner}>
          <Link to="/" className={logo && styles.logoWrapper}>
            <span className={`${logo && 'screen-reader-only'}`}>Home</span>
            {logo && (
              <img
                aria-hidden
                src={logo}
                alt={siteTitle}
                className={styles.siteLogo}
              />
            )}
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
  }
}

Header.propTypes = {
  siteTitle: PropTypes.string,
  tocVisability: PropTypes.bool,
  toggleToc: PropTypes.func,
  logo: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
