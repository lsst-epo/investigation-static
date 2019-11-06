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
  // constructor(props) {
  //   super(props);
  //
  // }

  componentDidMount() {
    const { navLinks } = this.props;
    const links = routes.concat(navLinks);
    this.navLinks = links.map(link => {
      if (link.divider || link.subheader) return link;

      if (link.to) {
        link.component = Link;
      }

      if (link.slug) {
        link.component = Link;
        link.label = link.title;
        link.to = `${TO_PREFIX}${link.slug}`;
        link.primaryText = link.title;
        link.active = false;
      }
      return link;
    });
  }

  handleVisibility = visible => {
    const { toggleSidebar } = this.props;
    toggleSidebar(visible);
  };

  render() {
    const { TEMPORARY } = Drawer.DrawerTypes;
    const { visible, toggleSidebar } = this.props;

    return (
      <Drawer
        type={TEMPORARY}
        className={styles.tableOfContents}
        visible={visible}
        onVisibilityChange={this.handleVisibility}
        navItems={this.navLinks}
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
