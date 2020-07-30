import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { globalHistory } from '@reach/router';
import reactn from 'reactn';
import find from 'lodash/find';
import { Toolbar } from 'react-md';
import Button from '../button/index';
import ButtonIcon from '../button/ButtonIcon';
import Close from '../icons/Close';
import Menu from '../icons/Menu';

import styles from './header.module.scss';

@reactn
class Header extends React.PureComponent {
  render() {
    const {
      location: { pathname },
    } = globalHistory;
    const { pageId } = this.global;
    const {
      investigationTitle,
      toggleToc,
      tocVisability,
      logo,
      pages,
    } = this.props;

    const pathnameArr = pathname.split('/');
    const path = pathnameArr[pathnameArr.length - 2];

    const currentPage = find(pages, { id: pageId });
    const { pageNumber } = currentPage || {};
    const currentPageNumber =
      !pageNumber || path === '' || path === 'last-page'
        ? null
        : `: Page ${pageNumber}`;

    return (
      <Toolbar
        role="banner"
        data-testid="site-header"
        colored
        fixed
        titleClassName="screen-reader-only"
        className="header-primary"
      >
        <div className={styles.innerContainer}>
          {toggleToc && (
            <Button
              className={`${styles.tocToggle} md-btn--toolbar md-toolbar--action-left`}
              flat
              iconBefore
              iconEl={
                tocVisability ? (
                  <ButtonIcon Icon={Close} />
                ) : (
                  <ButtonIcon Icon={Menu} />
                )
              }
              onClick={toggleToc}
            >
              <span role="presentation">Table Of Contents</span>
              <span className="screen-reader-only">{`${
                tocVisability ? 'Close' : 'Open'
              } Table of Contents`}</span>
            </Button>
          )}
          <span className={styles.investigationTitle}>
            {investigationTitle}
            {currentPageNumber}
          </span>
          <div className={styles.headerInner}>
            <Link to="/" className={logo && styles.logoWrapper}>
              <span className={`${logo && 'screen-reader-only'}`}>Home</span>
              {logo && (
                <img
                  aria-hidden
                  src={logo}
                  alt={investigationTitle}
                  className={styles.siteLogo}
                />
              )}
            </Link>
          </div>
        </div>
      </Toolbar>
    );
  }
}

Header.propTypes = {
  investigationTitle: PropTypes.string,
  tocVisability: PropTypes.bool,
  toggleToc: PropTypes.func,
  logo: PropTypes.string,
  pages: PropTypes.array,
};

export default Header;
