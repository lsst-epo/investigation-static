import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import Button from '../site/button';
import ArrowLeft from '../site/icons/ArrowLeft';
import ArrowRight from '../site/icons/ArrowRight';


class PageNav extends React.PureComponent {
  renderNavItem(type, item) {
    return (
      <Button
        icon
        primary
        swapTheming
        className="outlined"
        to={item.link === '' ? '/' : item.link}
        component={Link}
        iconEl={type === 'previous' ? <ArrowLeft /> : <ArrowRight />}
        iconBefore={type === 'previous'}
        tooltipLabel={type === 'previous' ? 'Back' : 'Continue'}
        tooltipPosition="top"
      />
    );
  }

  render() {
    const { previous, next } = this.props;

    return (
      <div className="page-navigation">
        <nav role="navigation" className="nav-secondary">
          {previous && this.renderNavItem('previous', previous)}
          {next && this.renderNavItem('next', next)}
        </nav>
      </div>
    );
  }
}

export default PageNav;

PageNav.propTypes = {
  previous: PropTypes.object,
  next: PropTypes.object,
};
