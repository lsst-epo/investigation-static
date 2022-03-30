import React from 'react';
import reactn from 'reactn';
import { Link, withTranslation } from 'gatsby-plugin-react-i18next';
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
  getNavLabel = (title, layout, sectionOrder) => {
    const { t } = this.props;
    const { sections } = this.global;
    const { sectionName } = sections[sectionOrder];

    return layout === 'SectionBreak'
      ? t('table_of_contents.section_break', { sectionName })
      : title;
  };

  getNavLink(link, useBaseUrl) {
    const {
      title,
      pageNumber,
      id,
      investigation: linkBaseUrl,
      slug,
      layout,
      sectionOrder,
    } = link;
    const baseUrl = linkBaseUrl && useBaseUrl ? `/${linkBaseUrl}/` : '/';
    const isActive = this.isActivePage(id);
    const allQsComplete = this.checkQAProgress(id);
    const { educatorMode } = this.global;
    const isDisabled = !educatorMode && !allQsComplete && !isActive;
    const label = this.getNavLabel(title, layout, sectionOrder || 0);

    return {
      component: Link,
      label,
      to: baseUrl + slug,
      primaryText: `${pageNumber}. ${label}`,
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
    const { t } = this.props;
    const navLinks = [
      ...filter(pages, page => page.investigation === investigation).map(page =>
        this.getNavLink(page, useBaseUrl)
      ),
    ];
    const baseUrl = investigation && useBaseUrl ? `/${investigation}/` : '/';

    const qaReviewLink = {
      component: Link,
      label: t('actions.review_your_answers'),
      to: baseUrl + 'qa-review/',
      primaryText: t('actions.review_your_answers'),
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
    const { visible, pages, investigation, isAll, t } = this.props;

    return (
      <Drawer
        header={
          <>
            <Progress type="small" />
            <hr className="md-divider" />
            <h4 className={heading}>{t('locations.table_of_contents')}</h4>
          </>
        }
        aria-label={t('locations.table_of_contents')}
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
  t: PropTypes.func,
};

export default withTranslation('interface')(TableOfContents);
