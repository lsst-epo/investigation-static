/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import reactn from 'reactn';
import { Link, graphql, StaticQuery } from 'gatsby';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import classnames from 'classnames';
import { Drawer } from 'react-md';
import styles from './table-of-contents.module.scss';
import Check from '../icons/Check';

@reactn
class TableOfContents extends React.PureComponent {
  constructor(props) {
    super(props);

    this.routes = [
      /* {
        label: 'home',
        to: `${this.TO_PREFIX}`,
        component: Link,
        icon: 'home',
        exact: 'true',
        primaryText: 'Home',
        active: this.global.pageId === 1,
        className: classnames(
          'toc-link',
          this.global.pageId === 1 ? 'link-active' : ''
        ),
      },
      { divider: true }, */
      {
        primaryText: 'Table of Contents',
        subheader: true,
      },
      { divider: true },
    ];
  }

  getNavLinks(navLinks, investigation) {
    return [
      ...this.routes,
      ...filter(navLinks, link => link.investigation === investigation).map(
        link => {
          if (link.divider || link.subheader) return link;
          const baseUrl = link.investigation ? `/${link.investigation}/` : '/';

          return {
            ...link,
            component: Link,
            label: link.title,
            to: baseUrl + link.slug,
            primaryText: link.title,
            leftIcon: <Check />,
            active: this.setActivePage(link.id),
            className: classnames(
              'toc-link',
              `link--page-id--${link.id}`,
              this.setActivePage(link.id) ? 'link-active' : '',
              this.checkQAProgress(link.id) ? 'qa-progress--complete' : ''
            ),
          };
        }
      ),
    ];
  }

  checkQAProgress(pageId) {
    // add some fancy logic to reflect page answer state.
    return +pageId === 5;
  }

  setActivePage = linkId => linkId === this.global.pageId;

  handleVisibility = visible => {
    const { toggleSidebar } = this.props;
    toggleSidebar(visible);
  };

  render() {
    const { TEMPORARY } = Drawer.DrawerTypes;
    const { visible, navLinks, investigation } = this.props;

    return (
      <Drawer
        type={TEMPORARY}
        className={styles.tableOfContents}
        visible={visible}
        onVisibilityChange={this.handleVisibility}
        navItems={this.getNavLinks(navLinks, investigation)}
        overlay
      />
    );
  }
}

TableOfContents.propTypes = {
  visible: PropTypes.bool,
  toggleSidebar: PropTypes.func.isRequired,
  navLinks: PropTypes.array,
  investigation: PropTypes.string,
};

// export default TableOfContents;

export default props => (
  <StaticQuery
    query={graphql`
      query MyQuery {
        allPagesJson(sort: { fields: order, order: ASC }) {
          nodes {
            title
            slug
            id
            investigation
            order
          }
        }
      }
    `}
    render={data => (
      <TableOfContents {...props} navLinks={data.allPagesJson.nodes} />
    )}
  />
);
