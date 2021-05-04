/* eslint-disable react/jsx-handler-names */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import classnames from 'classnames';
import Button from '../site/button';
import ButtonIcon from '../site/button/ButtonIcon';
import ArrowLeft from '../site/icons/ArrowLeft';
import ArrowRight from '../site/icons/ArrowRight';
import AnswerRequiredAlert from '../site/answerRequiredAlert';
import AnswersCompletedAlert from '../site/answersCompletedAlert';
import styles from './page-nav.module.scss';

class PageNav extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showAllRequiredAlert: false,
      showCompletedAlert: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { allQuestionsAnswered } = this.props;
    const { allQuestionsAnswered: prevAllQuestionsAnswered } = prevProps;

    if (allQuestionsAnswered && !prevAllQuestionsAnswered) {
      this.handleShowCompletedAlert();
    }
  }

  handleShowAllRequiredAlert = () => {
    this.setState(prevState => ({
      ...prevState,
      showAllRequiredAlert: true,
    }));
  };

  handleShowCompletedAlert = () => {
    this.setState(prevState => ({
      ...prevState,
      showCompletedAlert: true,
    }));
  };

  handleHideAllRequiredAlert = () => {
    this.setState(prevState => ({
      ...prevState,
      showAllRequiredAlert: false,
    }));
  };

  handleHideCompletedAlert = () => {
    this.setState(prevState => ({
      ...prevState,
      showCompletedAlert: false,
    }));
  };

  getNavLink(type, item, baseUrl) {
    const { link } = item;
    const linkIsBlank = link === '' || link === null;
    const isLinkToFirstPage = linkIsBlank && type === 'previous';
    const isLinkToLastPage = linkIsBlank && type === 'next';

    if (isLinkToFirstPage) {
      return `${baseUrl}`;
    }

    if (isLinkToLastPage) {
      return `${baseUrl}/qa-review/`;
    }

    return `${baseUrl}${link}`;
  }

  getButtonIconEl(type, title) {
    const { allQuestionsAnswered } = this.props;
    if (type === 'previous') {
      return <ButtonIcon srText={title || 'Home'} Icon={ArrowLeft} />;
    }
    return (
      <ButtonIcon
        srText={
          allQuestionsAnswered ? title || 'Home' : 'All Answers Are Required'
        }
        Icon={ArrowRight}
      />
    );
  }

  renderNavItem(type, item, baseUrl, allQuestionsAnswered = false) {
    const { link, title } = item;
    const linkIsBlank = link === '' || link === null;
    const isLinkToFirstPage = linkIsBlank && type === 'previous';
    const isLinkToLastPage = linkIsBlank && type === 'next';
    const isPrevOrAllQsA = type === 'previous' || allQuestionsAnswered;
    const buttonLink = this.getNavLink(type, item, baseUrl);
    const buttonClasses = classnames('outlined', {
      'is-disabled': !allQuestionsAnswered && type === 'next',
      'link-to-first': isLinkToFirstPage,
      'link-to-last': isLinkToLastPage,
    });

    if (isLinkToLastPage) {
      return (
        <Button
          flat
          swapTheming
          className={buttonClasses}
          to={buttonLink}
          component={Link}
          tooltipLabel={item.title}
          tooltipPosition="top"
        >
          Review your Answers
        </Button>
      );
    }

    return (
      <Button
        icon
        className={buttonClasses}
        to={isPrevOrAllQsA ? buttonLink : null}
        component={isPrevOrAllQsA ? Link : null}
        iconEl={this.getButtonIconEl(type, title)}
        onClick={isPrevOrAllQsA ? null : this.handleShowAllRequiredAlert}
        iconBefore={type === 'previous'}
        tooltipLabel={item.title}
        tooltipPosition="top"
      />
    );
  }

  render() {
    const { previous, next, baseUrl, allQuestionsAnswered } = this.props;
    const { showAllRequiredAlert, showCompletedAlert } = this.state;

    return (
      <>
        <AnswerRequiredAlert
          showAlert={showAllRequiredAlert && !allQuestionsAnswered}
          handleClose={this.handleHideAllRequiredAlert}
        />
        <AnswersCompletedAlert
          showAlert={showCompletedAlert && allQuestionsAnswered}
          nextUrl={this.getNavLink('next', next, baseUrl)}
          handleClose={this.handleHideCompletedAlert}
        />
        <div className={styles.pageNavigation}>
          <nav role="navigation" className={styles.navSecondary}>
            {previous && this.renderNavItem('previous', previous, baseUrl)}
            {next &&
              this.renderNavItem('next', next, baseUrl, allQuestionsAnswered)}
          </nav>
        </div>
      </>
    );
  }
}

export default PageNav;

PageNav.propTypes = {
  allQuestionsAnswered: PropTypes.bool,
  baseUrl: PropTypes.string,
  previous: PropTypes.object,
  next: PropTypes.object,
};
