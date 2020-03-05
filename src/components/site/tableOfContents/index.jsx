/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import reactn from 'reactn';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import classnames from 'classnames';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { Drawer } from 'react-md';
import styles from './table-of-contents.module.scss';
import Check from '../icons/Check';

@reactn
class TableOfContents extends React.PureComponent {
  componentWillUnmount() {
    this.clearTimeout();
  }

  getNavLinks(navLinks, investigation) {
    const { visitedPages, totalPages, totalQAsByInvestigation } = this.global;
    const {
      answers: totalAnswered,
      questions: totalQuestions,
    } = totalQAsByInvestigation;

    return [
      ...[
        { divider: true },
      ],
      ...filter(navLinks, link => link.investigation === investigation).map(
        link => {
          const baseUrl = link.investigation ? `/${link.investigation}/` : '/';
          const isActive = this.isActivePage(link.id);

          return {
            component: Link,
            label: link.title,
            to: baseUrl + link.slug,
            primaryText: link.title,
            leftIcon: <Check />,
            active: isActive,
            className: classnames('toc-link', `link--page-id--${link.id}`, {
              'link-active': isActive,
              'qa-progress--complete': this.checkQAProgress(link.id),
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
    const { toggleSidebar } = this.props;
    toggleSidebar(visible);
  };

  render() {
    const { TEMPORARY } = Drawer.DrawerTypes;
    const { visible, navLinks, investigation } = this.props;
    const { visitedPages, totalPages, totalQAsByInvestigation } = this.global;
    const {
      answers: totalAnswered,
      questions: totalQuestions,
    } = totalQAsByInvestigation;
    const pagesProgress = (visitedPages.length / totalPages) * 100;
    const questionsProgress = (totalAnswered / totalQuestions) * 100;
    return (
      <Drawer
        header={
          <div>
            <div className="headerTitle">Table of Contents</div>
            <div className="headerTitle">Pages Visited:</div>
            <LinearProgress id="PagesBar" value={pagesProgress} />
            <div className="headerTitle">Questions Answered:</div>
            <LinearProgress id="questionsBar" value={questionsProgress} />
          </div>
        }
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

export default TableOfContents;
