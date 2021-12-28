import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../site/modal';
import QuestionMark from '../site/icons/QuestionMark';

function Reference({ reference }) {
  const { modal } = reference;
  const { title, content } = modal;

  const openButtonOpts = {
    iconEl: <QuestionMark />,
    icon: true,
    primary: true,
    swapTheming: true,
  };

  const secondaryCloseButtonOpts = {
    primary: true,
    swapTheming: true,
    flat: true,
  };

  const renderContent = modalContent => ({ __html: modalContent });

  // eslint-disable-next-line react/no-danger
  const modalContent = <div dangerouslySetInnerHTML={renderContent(content)} />;

  return (
    <div className="reference-container">
      <Modal
        {...{
          children: modalContent,
          title,
          openButtonOpts,
          secondaryCloseButton: true,
          secondaryCloseButtonOpts,
        }}
      />
    </div>
  );
}

Reference.propTypes = {
  reference: PropTypes.object,
};

export default Reference;
