import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import Button from '../site/button';
import ButtonIcon from '../site/button/ButtonIcon';
import ArrowLeft from '../site/icons/ArrowLeft';
import ArrowRight from '../site/icons/ArrowRight';
import styles from './pageNav.module.scss';

class PageNav extends React.PureComponent {
  renderNavItem(type, item, baseUrl) {
    const { link, title } = item;

    return (
      <Button
        icon
        className="outlined"
        to={link === '' ? `${baseUrl}` : `${baseUrl}${link}`}
        component={Link}
        iconEl={
          type === 'previous' ? (
            <ButtonIcon srText={title || 'Home'} Icon={ArrowLeft} />
          ) : (
            <ButtonIcon srText={title || 'Home'} Icon={ArrowRight} />
          )
        }
        iconBefore={type === 'previous'}
        tooltipLabel={item.title}
        tooltipPosition="top"
      />
    );
  }

  render() {
    const { previous, next, baseUrl } = this.props;

    return (
      <div className={styles.pageNavigation}>
        <nav role="navigation" className={styles.navSecondary}>
          {previous && this.renderNavItem('previous', previous, baseUrl)}
          {next && this.renderNavItem('next', next, baseUrl)}
        </nav>
      </div>
    );
  }
}

export default PageNav;

PageNav.propTypes = {
  baseUrl: PropTypes.string,
  previous: PropTypes.object,
  next: PropTypes.object,
};
