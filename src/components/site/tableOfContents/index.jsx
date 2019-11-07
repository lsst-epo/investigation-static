/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import reactn from 'reactn';
import { Link, graphql, StaticQuery } from 'gatsby';
import PropTypes from 'prop-types';
import { Drawer } from 'react-md';
import styles from './table-of-contents.module.scss';

// import Footer from '../components/site/footer';
const TO_PREFIX = '/';
const routes = [
  {
    label: 'home',
    to: `${TO_PREFIX}`,
    icon: 'home',
    exact: 'true',
    primaryText: 'Home',
    active: false,
  },
  {
    label: 'style-guide',
    to: `${TO_PREFIX}StyleGuide`,
    icon: 'style',
    primaryText: 'Style Guide',
    active: false,
  },
  { divider: true },
  {
    primaryText: 'Table of Contents',
    subheader: true,
  },
];

@reactn
class TableOfContents extends React.PureComponent {
  constructor(props) {
    super(props);

    this.TO_PREFIX = '/';
    this.routes = [
      {
        label: 'home',
        to: `${this.TO_PREFIX}`,
        component: Link,
        icon: 'home',
        exact: 'true',
        primaryText: 'Home',
        active: false,
      },
      { divider: true },
      {
        primaryText: 'Table of Contents',
        subheader: true,
      },
      { divider: true },
    ];
  }

  componentDidMount() {
    this.updateNavLinks();
  }

  componentDidUpdate() {
    this.updateNavLinks();
  }

  updateNavLinks = () => {
    const { navLinks } = this.props;
    const massagedNavLinks = this.getNavLinks(navLinks);
    this.navLinks = [...this.routes, ...massagedNavLinks];
  };

  setActivePage = linkId => {
    return linkId === this.global.pageId;
  };

  getNavLinks = navLinks => {
    return navLinks.map(link => {
      if (link.divider || link.subheader) return link;
      return {
        ...link,
        component: Link,
        label: link.title,
        to: `${this.TO_PREFIX}${link.slug}`,
        primaryText: link.title,
        active: this.setActivePage(link.id),
      };
    });
  };

  handleVisibility = visible => {
    const { toggleSidebar } = this.props;
    toggleSidebar(visible);
  };

  render() {
    const { TEMPORARY } = Drawer.DrawerTypes;
    const { visible } = this.props;
    return (
      <Drawer
        type={TEMPORARY}
        className={styles.tableOfContents}
        visible={visible}
        onVisibilityChange={this.handleVisibility}
        navItems={this.navLinks}
        overlay
      />
    );
  }
}

TableOfContents.propTypes = {
  visible: PropTypes.bool,
  toggleSidebar: PropTypes.func.isRequired,
  navLinks: PropTypes.array,
};

// export default TableOfContents;

export default props => (
  <StaticQuery
    query={graphql`
      query MyQuery {
        allPagesJson {
          nodes {
            title
            slug
            id
          }
        }
      }
    `}
    render={data => (
      <TableOfContents {...props} navLinks={data.allPagesJson.nodes} />
    )}
  />
);
