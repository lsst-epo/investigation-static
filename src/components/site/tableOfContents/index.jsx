import React from 'react';
import reactn from 'reactn';
import { Link } from 'gatsby';
import { Trans } from 'gatsby-plugin-react-i18next';
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
import EducatorModeToggle from '../educatorModeToggle';

@reactn
class TableOfContents extends React.PureComponent {
  getNavLink(link, useBaseUrl) {
    const { title, pageNumber, id, investigation: linkBaseUrl, slug } = link;
    const baseUrl = linkBaseUrl && useBaseUrl ? `/${linkBaseUrl}/` : '/';
    const isActive = this.isActivePage(id);
    const allQsComplete = this.checkQAProgress(id);
    const { educatorMode } = this.global;
    const isDisabled = !educatorMode && !allQsComplete && !isActive;

    return {
      component: Link,
      label: title,
      to: baseUrl + slug,
      primaryText: `${pageNumber}. ${title}`,
      leftIcon: <Check />,
      active: isActive,
      disabled: isDisabled,
      className: classnames('toc-link', `link--page-id--${id}`, {
        'link-active': isActive,
        'qa-progress--complete': allQsComplete,
        [disabledLink]: isDisabled,
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
      label: <Trans>interface::actions.review_your_answers</Trans>,
      to: baseUrl + 'qa-review/',
      primaryText: <Trans>interface::actions.review_your_answers</Trans>,
      leftIcon: <Star />,
      active: true,
      disabled: false,
      className: classnames('toc-link', 'link-qa-review', {
        'link-active': true,
        'qa-progress--complete': true,
        [disabledLink]: false,
      }),
    };

    const educatorModeToggle = {
      component: EducatorModeToggle,
      primaryText: 'Educator Mode Toggle',
    };

    navLinks.push(qaReviewLink, educatorModeToggle);
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
            <h4 className={heading}>
              <Trans>interface::locations.table_of_contents</Trans>
            </h4>
          </>
        }
        aria-label={<Trans>interface::locations.table_of_contents</Trans>}
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
