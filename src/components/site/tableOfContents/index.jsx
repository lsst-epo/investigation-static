import React from 'react';
import reactn from 'reactn';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import classnames from 'classnames';
import { Drawer } from 'react-md';
import Check from '../icons/Check';
import Progress from '../progress/index.jsx';
import { tableOfContents, heading } from './table-of-contents.module.scss';

@reactn
class TableOfContents extends React.PureComponent {
  getNavLinks(navLinks, investigation, useBaseUrl) {
    return [
      ...filter(navLinks, link => link.investigation === investigation).map(
        link => {
          if (link.divider || link.subheader) return link;
          const { title, id, investigation: linkBaseUrl, slug } = link;
          const baseUrl = linkBaseUrl && useBaseUrl ? `/${linkBaseUrl}/` : '/';
          const isActive = this.isActivePage(id);

          return {
            component: Link,
            label: title,
            to: baseUrl + slug,
            primaryText: title,
            leftIcon: <Check />,
            active: isActive,
            className: classnames('toc-link', `link--page-id--${id}`, {
              'link-active': isActive,
              'qa-progress--complete': this.checkQAProgress(id),
            }),
          };
        }
      ),
    ];
  }

  checkQAProgress(pageId) {
    const { totalQAsByPage } = this.global;
    const { progress } = totalQAsByPage[pageId] || {};

    return progress === 1;
  }

  isActivePage = linkId => {
    return linkId === this.global.pageId;
  };

  handleVisibility = visible => {
    const { toggleToc } = this.props;
    toggleToc(visible);
  };

  render() {
    const { TEMPORARY } = Drawer.DrawerTypes;
    const { visible, navLinks, investigation, isAll } = this.props;

    return (
      <Drawer
        header={
          <>
            <Progress />
            <hr className="md-divider" />
            <h4 className={heading}>Table of Contents</h4>
          </>
        }
        aria-label="Table of Contents"
        type={TEMPORARY}
        className={tableOfContents}
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
