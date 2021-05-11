import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CloseIcon from '../icons/Close.jsx';
import StopIcon from '../icons/Stop.jsx';
import CheckmarkIcon from '../icons/Checkmark.jsx';
import {
  notification,
  contentIcon,
  contentInner,
  closeButton,
  showNotification,
  divider,
} from './notification.module.scss';

const Notification = props => {
  const { classes, show, delay, showFor, icon, children, handleClose } = props;
  const icons = {
    StopIcon,
    CheckmarkIcon,
  };
  const Icon = icons[icon];

  const timeout = useRef(null);
  const [delayedShow, setDelayedShow] = useState(false);

  useEffect(() => {
    if (show) {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setDelayedShow(true);
      }, delay);
    } else {
      setDelayedShow(false);
    }
  }, [show]);

  useEffect(() => {
    if (delayedShow) {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(handleClose, showFor);
    } else {
      clearTimeout(timeout.current);
    }
  }, [delayedShow]);

  return (
    <div
      className={classnames(notification, classes, {
        [showNotification]: delayedShow,
      })}
    >
      <button type="button" className={closeButton} onClick={handleClose}>
        <CloseIcon />
      </button>
      <div className={contentInner}>
        {icon && (
          <>
            <Icon className={contentIcon} />
            <div className={divider} />
          </>
        )}
        {children}
      </div>
    </div>
  );
};

Notification.defaultProps = {
  delay: 0,
  showFor: 5000,
};

Notification.propTypes = {
  classes: PropTypes.string,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  delay: PropTypes.number,
  showFor: PropTypes.number,
  icon: PropTypes.string,
  children: PropTypes.node,
};

export default Notification;
