import PropTypes from 'prop-types';
import React from 'react';
import { Toolbar } from 'react-md';
import Button from '../button/index';
import ButtonIcon from '../button/ButtonIcon';
import Close from '../icons/Close';
import Menu from '../icons/Menu';

import styles from './header.module.scss';
import HeaderProgress from './HeaderProgress';

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
      sections,
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
            {logo && (
              <a
                href="http://rubineducation.org/"
                className={styles.logoWrapper}
              >
                <span className="screen-reader-only">Rubin Education</span>
                <img
                  aria-hidden
                  src={logo}
                  alt={investigationTitle}
                  className={styles.siteLogo}
                />
              </a>
            )}
          </div>
        </div>
        {pageNumber && (
          <HeaderProgress {...{ pageNumber, totalPages, sections }} />
        )}
      </Toolbar>
    );
  }
}

Header.propTypes = {
  sections: PropTypes.array,
  investigationTitle: PropTypes.string,
  tocVisability: PropTypes.bool,
  toggleToc: PropTypes.func,
  logo: PropTypes.string,
  pageNumber: PropTypes.number,
  totalPages: PropTypes.number,
};

export default Header;
