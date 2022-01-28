import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useKeyDownEvent, useOnClickOutside } from '../../../hooks/listeners';
import useFocusTrap from '../../../hooks/useFocusTrap';
import Button from '../button';
import Close from '../icons/Close';

function Modal({
  children,
  openButtonOpts,
  openCallback,
  closeButtonOpts,
  closeCallback,
  closeKey,
  labelledbyId,
  describedbyId,
  secondaryCloseButton,
  secondaryCloseButtonOpts,
  classes,
  title,
  size,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  function handleClose() {
    if (!isOpen) return;
    setIsOpen(false);
    if (closeCallback) closeCallback(false);
  }

  function handleOpen() {
    if (isOpen) return;
    setIsOpen(true);
    if (openCallback) openCallback();
  }

  function handleKeyDown({ key }) {
    if (!isOpen) return;
    if (key === 'Escape') {
      handleClose();
    }

    if (closeKey && key === closeKey) {
      handleClose();
    }
  }

  useFocusTrap(modalRef, isOpen);
  useKeyDownEvent(handleKeyDown);
  useOnClickOutside(modalRef, handleClose);

  return (
    <div className={classnames({ 'modal-container': true, 'is-open': isOpen })}>
      <Button {...openButtonOpts} onClick={handleOpen}>
        {openButtonOpts.text}
      </Button>
      <div
        role="dialog"
        aria-modal
        aria-labelledby={labelledbyId}
        aria-describedby={describedbyId}
        className={classnames(
          'modal',
          {
            'is-open': isOpen,
            [`modal-${size}`]: size,
          },
          classes
        )}
      >
        <div
          ref={modalRef}
          className={classnames(
            'modal-dialog',
            'animate__animated',
            'animate__faster',
            {
              animate__fadeIn: isOpen,
            }
          )}
          role="document"
        >
          <header className="modal-header">
            {title && <h1 className="modal-title">{title}</h1>}
            <Button
              {...closeButtonOpts}
              onClick={handleClose}
              className="close-button"
            />
          </header>
          <div className="modal-body">
            {children}
            {secondaryCloseButton && (
              <footer>
                <Button {...secondaryCloseButtonOpts} onClick={handleClose}>
                  Close
                </Button>
              </footer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Modal.defaultProps = {
  closeButtonOpts: {
    iconEl: <Close />,
    icon: true,
  },
};

Modal.propTypes = {
  children: PropTypes.element,
  labelledbyId: PropTypes.string,
  describedbyId: PropTypes.string,
  openButtonOpts: PropTypes.object,
  closeButtonOpts: PropTypes.object,
  secondaryCloseButton: PropTypes.bool,
  secondaryCloseButtonOpts: PropTypes.object,
  openCallback: PropTypes.func,
  closeCallback: PropTypes.func,
  closeKey: PropTypes.string,
  classes: PropTypes.string,
  size: PropTypes.string,
  title: PropTypes.string,
};

export default Modal;
