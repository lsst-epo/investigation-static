import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CloseIcon from '../../../icons/Close.jsx';
import StopIcon from '../../../icons/Stop.jsx';
import {
  answerRequiredInner,
  answerRequired,
  closeButton,
  showAnswerRequired,
  stopIcon,
  divider,
} from './answer-required.module.scss';

const AnswerRequiredAlert = ({ showAlert, handleClose }) => {
  const alertTimeout = useRef(null);

  useEffect(() => {
    if (showAlert) {
      alertTimeout.current = setTimeout(handleClose, 5000);
    } else {
      clearTimeout(alertTimeout.current);
    }
  }, [showAlert]);

  const alertClasses = classnames(answerRequired, {
    [showAnswerRequired]: showAlert,
  });

  return (
    <div className={alertClasses}>
      <button type="button" className={closeButton} onClick={handleClose}>
        <CloseIcon />
      </button>
      <div className={answerRequiredInner}>
        <StopIcon className={stopIcon} />
        <div className={divider} />
        <p>Please answer all questions before continuing to the next page.</p>
      </div>
    </div>
  );
};

AnswerRequiredAlert.propTypes = {
  showAlert: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default AnswerRequiredAlert;
