/* eslint-disable react/jsx-handler-names */
import React from 'reactn';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { Trans } from 'gatsby-plugin-react-i18next';
import classnames from 'classnames';
import Button from '../site/button';
import ButtonIcon from '../site/button/ButtonIcon';
import ArrowLeft from '../site/icons/ArrowLeft';
import ArrowRight from '../site/icons/ArrowRight';
import Notification from '../site/notification';
import styles from './page-nav.module.scss';

class PageNav extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showAllRequiredNotification: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { allQuestionsAnswered } = this.props;
    const { allQuestionsAnswered: prevAllQuestionsAnswered } = prevProps;

    if (allQuestionsAnswered && !prevAllQuestionsAnswered) {
      this.handleHideAllRequiredNotification();
    }
  }

  handleShowAllRequiredNotification = () => {
    const { allQuestionsAnswered } = this.props;
    this.setState(prevState => ({
      ...prevState,
      showAllRequiredNotification: true && !allQuestionsAnswered,
    }));
  };

  handleHideAllRequiredNotification = () => {
    this.setState(prevState => ({
      ...prevState,
      showAllRequiredNotification: false,
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
    const homeText = <Trans>interface::locations.home</Trans>;
    const allQasRequiredText = (
      <Trans>interface::notifications.answer_all_qa</Trans>
    );
    if (type === 'previous') {
      return <ButtonIcon srText={title || homeText} Icon={ArrowLeft} />;
    }
    return (
      <ButtonIcon
        srText={allQuestionsAnswered ? title || homeText : allQasRequiredText}
        Icon={ArrowRight}
      />
    );
  }

  renderNavItem(type, item, baseUrl, allQuestionsAnswered = false) {
    const { educatorMode } = this.global;
    const { link, title } = item;
    const linkIsBlank = link === '' || link === null;
    const isLinkToFirstPage = linkIsBlank && type === 'previous';
    const isLinkToLastPage = linkIsBlank && type === 'next';
    const isPrevOrAllQsA = type === 'previous' || allQuestionsAnswered;
    const allowProgression = isPrevOrAllQsA || educatorMode;
    const buttonLink = this.getNavLink(type, item, baseUrl);
    const buttonClasses = classnames('outlined', {
      'is-disabled': !educatorMode && !allQuestionsAnswered && type === 'next',
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
          <Trans>interface::actions.review_your_answers</Trans>
        </Button>
      );
    }

    return (
      <Button
        icon
        className={buttonClasses}
        to={allowProgression ? buttonLink : null}
        component={allowProgression ? Link : null}
        iconEl={this.getButtonIconEl(type, title)}
        onClick={
          allowProgression ? null : this.handleShowAllRequiredNotification
        }
        iconBefore={type === 'previous'}
        tooltipLabel={item.title}
        tooltipPosition="top"
      />
    );
  }

  render() {
    const { previous, next, baseUrl, allQuestionsAnswered } = this.props;
    const { showAllRequiredNotification } = this.state;

    return (
      <>
        <Notification
          classes={styles.answersRequired}
          show={showAllRequiredNotification}
          handleClose={this.handleHideAllRequiredNotification}
          icon="StopIcon"
        >
          <p>
            <Trans>interface::notifications.answer_all_qa</Trans>
          </p>
        </Notification>
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
