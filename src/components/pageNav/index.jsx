import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import Button from '../site/button';
import ButtonIcon from '../site/button/ButtonIcon';
import ArrowLeft from '../site/icons/ArrowLeft';
import ArrowRight from '../site/icons/ArrowRight';
import styles from './page-nav.module.scss';

class PageNav extends React.PureComponent {
  renderNavItem(type, item, baseUrl, disableButton = false) {
    const { link, title } = item;
    const linkIsBlank = link === '' || link === null;
    const isLinkToFirstPage = linkIsBlank && type === 'previous';
    const isLinkToLastPage = linkIsBlank && type === 'next';
    let buttonLink = `${baseUrl}${link}`;

    if (isLinkToFirstPage) {
      buttonLink = `${baseUrl}`;
    } else if (isLinkToLastPage) {
      // buttonLink = `${baseUrl}/last-page/`;
      buttonLink = `${baseUrl}/qa-review/`;
    }

    return (
      <Button
        icon
        className="outlined"
        to={buttonLink}
        component={disableButton ? null : Link}
        iconEl={
          type === 'previous' ? (
            <ButtonIcon srText={title || 'Home'} Icon={ArrowLeft} />
          ) : (
            <ButtonIcon srText={title || 'Home'} Icon={ArrowRight} />
          )
        }
        disabled={disableButton}
        iconBefore={type === 'previous'}
        tooltipLabel={item.title}
        tooltipPosition="top"
      />
    );
  }

  render() {
    const { previous, next, baseUrl, disableButton } = this.props;

    return (
      <div className={styles.pageNavigation}>
        <nav role="navigation" className={styles.navSecondary}>
          {previous && this.renderNavItem('previous', previous, baseUrl)}
          {next && this.renderNavItem('next', next, baseUrl, disableButton)}
        </nav>
      </div>
    );
  }
}

export default PageNav;

PageNav.propTypes = {
  disableButton: PropTypes.bool,
  baseUrl: PropTypes.string,
  previous: PropTypes.object,
  next: PropTypes.object,
};
