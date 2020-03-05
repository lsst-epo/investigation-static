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
  getNavLinks(navLinks, investigation, useBaseUrl) {
    return [
      ...[{ divider: true }],
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
