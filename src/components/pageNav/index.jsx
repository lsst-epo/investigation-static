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
      allAnswered: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { disableButton } = this.props;
    const { disableButton: prevDisableButton } = prevProps;

    if (disableButton) {
      this.updateAllAnswersBool(false);
    } else {
      this.updateAllAnswersBool(true);
    }

    if (!disableButton && prevDisableButton) {
      this.handleShowCompletedAlert();
    }
  }

  updateAllAnswersBool(state) {
    this.setState(prevState => ({
      ...prevState,
      allAnswered: state,
    }));
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

  renderNavItem(type, item, baseUrl, disableButton = false) {
    const { link, title } = item;
    const linkIsBlank = link === '' || link === null;
    const isLinkToFirstPage = linkIsBlank && type === 'previous';
    const isLinkToLastPage = linkIsBlank && type === 'next';
    const buttonLink = this.getNavLink(type, item, baseUrl);
    const buttonClasses = classnames('outlined', {
      'is-disabled': disableButton,
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
        to={!disableButton ? buttonLink : null}
        component={!disableButton ? Link : null}
        iconEl={
          type === 'previous' ? (
            <ButtonIcon srText={title || 'Home'} Icon={ArrowLeft} />
          ) : (
            <ButtonIcon
              srText={
                !disableButton ? title || 'Home' : 'All Answers Are Required'
              }
              Icon={ArrowRight}
            />
          )
        }
        onClick={!disableButton ? null : this.handleShowAllRequiredAlert}
        iconBefore={type === 'previous'}
        tooltipLabel={!disableButton ? item.title : 'All Answers Are Required'}
        tooltipPosition="top"
      />
    );
  }

  render() {
    const { previous, next, baseUrl, disableButton } = this.props;
    const { showAllRequiredAlert, showCompletedAlert } = this.state;

    return (
      <>
        <AnswerRequiredAlert
          showAlert={
            showAllRequiredAlert && !disableButton
              ? false
              : showAllRequiredAlert
          }
          handleClose={this.handleHideAllRequiredAlert}
        />
        <AnswersCompletedAlert
          showAlert={
            showCompletedAlert && disableButton ? false : showCompletedAlert
          }
          nextUrl={this.getNavLink('next', next, baseUrl)}
          handleClose={this.handleHideCompletedAlert}
        />
        <div className={styles.pageNavigation}>
          <nav role="navigation" className={styles.navSecondary}>
            {previous && this.renderNavItem('previous', previous, baseUrl)}
            {next && this.renderNavItem('next', next, baseUrl, disableButton)}
          </nav>
        </div>
      </>
    );
  }
}

export default PageNav;

PageNav.propTypes = {
  disableButton: PropTypes.bool,
  baseUrl: PropTypes.string,
  previous: PropTypes.object,
  next: PropTypes.object,
};
