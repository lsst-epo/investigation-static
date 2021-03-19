import React from 'react';
import reactn from 'reactn';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import classnames from 'classnames';
import { Drawer } from 'react-md';
import Check from '../icons/Check';
import Star from '../icons/Star';
import Progress from '../progress/index.jsx';
import {
  tableOfContents,
  heading,
  disabledLink,
} from './table-of-contents.module.scss';

@reactn
class TableOfContents extends React.PureComponent {
  getNavLink(link, useBaseUrl) {
    const { title, pageNumber, id, investigation: linkBaseUrl, slug } = link;
    const baseUrl = linkBaseUrl && useBaseUrl ? `/${linkBaseUrl}/` : '/';
    const isActive = this.isActivePage(id);
    const allQsComplete = this.checkQAProgress(id);

    return {
      component: Link,
      label: title,
      to: baseUrl + slug,
      primaryText: `${pageNumber}. ${title}`,
      leftIcon: <Check />,
      active: isActive,
      disabled: !allQsComplete && !isActive,
      className: classnames('toc-link', `link--page-id--${id}`, {
        'link-active': isActive,
        'qa-progress--complete': allQsComplete,
        [disabledLink]: !allQsComplete && !isActive,
      }),
    };
  }

  getNavLinks(pages, investigation, useBaseUrl) {
    const navLinks = [
      ...filter(pages, page => page.investigation === investigation).map(page =>
        this.getNavLink(page, useBaseUrl)
      ),
    ];
    const baseUrl = investigation && useBaseUrl ? `/${investigation}/` : '/';

    const qaReviewLink = {
      component: Link,
      label: 'Review Your Answers',
      to: baseUrl + 'qa-review/',
      primaryText: 'Review Your Answers',
      leftIcon: <Star />,
      active: true,
      disabled: false,
      className: classnames('toc-link', 'link-qa-review', {
        'link-active': true,
        'qa-progress--complete': true,
        [disabledLink]: false,
      }),
    };

    navLinks.push(qaReviewLink);
    return navLinks;
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
    const { visible, pages, investigation, isAll } = this.props;

    return (
      <Drawer
        header={
          <>
            <Progress type="small" />
            <hr className="md-divider" />
            <h4 className={heading}>Table of Contents</h4>
          </>
        }
        aria-label="Table of Contents"
        type={TEMPORARY}
        className={tableOfContents}
        visible={visible}
        onVisibilityChange={this.handleVisibility}
        navItems={this.getNavLinks(pages, investigation, isAll)}
        overlay
      />
    );
  }
}

TableOfContents.propTypes = {
  isAll: PropTypes.bool,
  visible: PropTypes.bool,
  toggleToc: PropTypes.func.isRequired,
  pages: PropTypes.array,
  investigation: PropTypes.string,
};

export default TableOfContents;
