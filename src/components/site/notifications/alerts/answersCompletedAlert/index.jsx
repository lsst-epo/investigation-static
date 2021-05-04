import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import classnames from 'classnames';
import CloseIcon from '../../../icons/Close.jsx';
import CheckmarkIcon from '../../../icons/Checkmark.jsx';
import {
  answersCompleted,
  answersCompletedInner,
  closeButton,
  showAnswersCompleted,
  checkmarkIcon,
  divider,
  nextLink,
} from './answers-completed.module.scss';

const AnswersCompletedAlert = ({ showAlert, handleClose, nextUrl }) => {
  const alertTimeout = useRef(null);
  const delayTimeout = useRef(null);
  const [delayedShow, setDelayedShow] = useState(false);

  useEffect(() => {
    if (showAlert) {
      clearTimeout(delayTimeout.current);
      delayTimeout.current = setTimeout(() => {
        setDelayedShow(true);
      }, 15000);
    } else {
      setDelayedShow(false);
      clearTimeout(delayTimeout.current);
    }
  }, [showAlert]);

  useEffect(() => {
    if (delayedShow) {
      clearTimeout(alertTimeout.current);
      alertTimeout.current = setTimeout(handleClose, 8000);
    } else {
      clearTimeout(alertTimeout.current);
    }
  }, [delayedShow]);

  const alertClasses = classnames(answersCompleted, {
    [showAnswersCompleted]: showAlert,
  });

  return (
    <div className={alertClasses}>
      <button type="button" className={closeButton} onClick={handleClose}>
        <CloseIcon />
      </button>
      <div className={answersCompletedInner}>
        <CheckmarkIcon className={checkmarkIcon} />
        <div className={divider} />
        <p>
          You answered all of the questions on this page.{' '}
          <Link className={nextLink} to={nextUrl}>
            Go to the next page
          </Link>{' '}
          when you&apos;re ready.
        </p>
      </div>
    </div>
  );
};

AnswersCompletedAlert.propTypes = {
  showAlert: PropTypes.bool,
  handleClose: PropTypes.func,
  nextUrl: PropTypes.string,
};

export default AnswersCompletedAlert;
