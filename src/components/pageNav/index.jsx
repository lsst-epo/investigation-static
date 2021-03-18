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
import styles from './page-nav.module.scss';

class PageNav extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showAlert: false,
    };
  }

  componentDidMount() {
    this.setState(prevState => ({
      ...prevState,
      showAlert: false,
    }));
  }

  handleShowAlert = () => {
    this.setState(prevState => ({
      ...prevState,
      showAlert: true,
    }));
  };

  handleHideAlert = () => {
    this.setState(prevState => ({
      ...prevState,
      showAlert: false,
    }));
  };

  renderNavItem(type, item, baseUrl, disableButton = false) {
    const { link, title } = item;
    const linkIsBlank = link === '' || link === null;
    const isLinkToFirstPage = linkIsBlank && type === 'previous';
    const isLinkToLastPage = linkIsBlank && type === 'next';
    let buttonLink = `${baseUrl}${link}`;
    const buttonClasses = classnames('outlined', {
      'is-disabled': disableButton,
    });

    if (isLinkToFirstPage) {
      buttonLink = `${baseUrl}`;
    } else if (isLinkToLastPage) {
      // buttonLink = `${baseUrl}/last-page/`;
      buttonLink = `${baseUrl}/qa-review/`;
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
        onClick={!disableButton ? null : this.handleShowAlert}
        iconBefore={type === 'previous'}
        tooltipLabel={!disableButton ? item.title : 'All Answers Are Required'}
        tooltipPosition="top"
      />
    );
  }

  render() {
    const { previous, next, baseUrl, disableButton } = this.props;
    const { showAlert } = this.state;

    return (
      <>
        <AnswerRequiredAlert
          showAlert={showAlert && !disableButton ? false : showAlert}
          handleClose={this.handleHideAlert}
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
