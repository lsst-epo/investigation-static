/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import reactn from 'reactn';
import { Link } from 'gatsby';
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
      {
        primaryText: 'Table of Contents',
        subheader: true,
      },
      { divider: true },
    ];
  }

  getNavLinks(navLinks, investigation, useBaseUrl) {
    return [
      ...this.routes,
      ...filter(navLinks, link => link.investigation === investigation).map(
        link => {
          if (link.divider || link.subheader) return link;
          const { title, id, investigation: linkBaseUrl, slug } = link;
          const baseUrl = linkBaseUrl && useBaseUrl ? `/${linkBaseUrl}/` : '/';

          return {
            component: Link,
            label: title,
            to: baseUrl + slug,
            primaryText: title,
            leftIcon: <Check />,
            active: this.setActivePage(id),
            className: classnames('toc-link', `link--page-id--${id}`, {
              'link-active': this.setActivePage(id),
              'qa-progress--complete': this.checkQAProgress(id),
            }),
          };
        }
      ),
    ];
  }

  checkQAProgress = pageId => {
    const { totalQAsByPage } = this.global;
    const { progress } = totalQAsByPage[pageId];

    return progress === 1;
  };

  setActivePage = linkId => linkId === this.global.pageId;

  handleVisibility = visible => {
    const { toggleToc } = this.props;
    toggleToc(visible);
  };

  render() {
    const { TEMPORARY } = Drawer.DrawerTypes;
    const { visible, navLinks, investigation, isAll } = this.props;

    return (
      <Drawer
        type={TEMPORARY}
        className={styles.tableOfContents}
        visible={visible}
        onVisibilityChange={this.handleVisibility}
        navItems={this.getNavLinks(navLinks, investigation, isAll)}
        overlay
      />
    );
  }
}

TableOfContents.propTypes = {
  isAll: PropTypes.bool,
  visible: PropTypes.bool,
  toggleToc: PropTypes.func.isRequired,
  navLinks: PropTypes.array,
  investigation: PropTypes.string,
};

export default TableOfContents;
// export default props => (
//   <StaticQuery
//     query={graphql`
//       query MyQuery {
//         allPagesJson(sort: { fields: order, order: ASC }) {
//           nodes {
//             title
//             slug
//             id
//             investigation
//             order
//             questionsByPage {
//               question {
//                 id
//               }
//             }
//           }
//         }
//       }
//     `}
//     render={data => (
//       <TableOfContents {...props} navLinks={data.allPagesJson.nodes} />
//     )}
//   />
// );
//
