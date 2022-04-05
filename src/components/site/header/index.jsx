import PropTypes from 'prop-types';
import React from 'react';
import { Toolbar } from 'react-md';
import { Trans } from 'gatsby-plugin-react-i18next';
import Button from '../button/index';
import ButtonIcon from '../button/ButtonIcon';
import Close from '../icons/Close';
import Menu from '../icons/Menu';

import styles from './header.module.scss';
import HeaderProgressContainer from '../../../containers/HeaderProgressContainer';
import LanguageToggleContainer from '../../../containers/LanguageToggleContainer';

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
              <span role="presentation">
                <Trans>interface::locations.table_of_contents</Trans>
              </span>
              <span className="screen-reader-only">
                {tocVisability ? (
                  <Trans>interface::header.toc_close</Trans>
                ) : (
                  <Trans>interface::header.toc_open</Trans>
                )}
              </span>
            </Button>
          )}
          <span className={styles.investigationTitle}>
            <Trans
              values={{
                investigation: investigationTitle,
                pageCount:
                  pageNumber && totalPages
                    ? '$t(interface::header.page_count, {"current": {{currentPage}}, "total": {{totalPages}}})'
                    : '',
                currentPage: pageNumber,
                totalPages,
              }}
            >
              interface::header.title
            </Trans>
          </span>
          <div className={styles.headerInner}>
            <LanguageToggleContainer />
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
          <HeaderProgressContainer {...{ pageNumber, totalPages, sections }} />
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
