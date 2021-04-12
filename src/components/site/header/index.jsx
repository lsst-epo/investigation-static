import PropTypes from 'prop-types';
import React from 'react';
import { Toolbar } from 'react-md';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Button from '../button/index';
import ButtonIcon from '../button/ButtonIcon';
import Close from '../icons/Close';
import Menu from '../icons/Menu';

import styles from './header.module.scss';

class Header extends React.PureComponent {
  checkQAProgress(pageId) {
    const { totalQAsByPage } = this.global;
    const { progress } = totalQAsByPage[pageId] || {};

    return progress === 1;
  }

  isActivePage = linkId => {
    return linkId === this.global.pageId;
  };

  render() {
    const {
      investigationTitle,
      toggleToc,
      tocVisability,
      logo,
      pageNumber,
      totalPages,
    } = this.props;

    return (
      <Toolbar
        role="banner"
        data-testid="site-header"
        colored
        fixed
        titleClassName="screen-reader-only"
        className={`${styles.headerPrimary} dont-print`}
      >
        <div className={styles.progressBarWrapper}>
          <LinearProgress
            id="current-page-of-total"
            value={pageNumber ? (pageNumber / totalPages) * 100 : 0}
          />
        </div>
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
            {pageNumber &&
              totalPages &&
              `: Page ${pageNumber} of ${totalPages}`}
          </span>
          <div className={styles.headerInner}>
            <a
              href="http://rubineducation.org/"
              className={logo && styles.logoWrapper}
            >
              <span className={`${logo && 'screen-reader-only'}`}>
                Rubin Education
              </span>
              {logo && (
                <img
                  aria-hidden
                  src={logo}
                  alt={investigationTitle}
                  className={styles.siteLogo}
                />
              )}
            </a>
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
  pageNumber: PropTypes.number,
  totalPages: PropTypes.number,
};

export default Header;
