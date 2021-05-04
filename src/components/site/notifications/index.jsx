/* eslint-disable react/jsx-handler-names */
import React from 'react';
import PropTypes from 'prop-types';
import AnswerRequiredAlert from './alerts/answerRequiredAlert';
import AnswersCompletedAlert from './alerts/answersCompletedAlert';

class Notifications extends React.PureComponent {
  render() {
    const {
      showAllRequiredAlert,
      showCompletedAlert,
      nextUrl,
      handleHideAllRequiredAlert,
      handleHideCompletedAlert,
    } = this.props;

    return (
      <>
        <AnswerRequiredAlert
          showAlert={showAllRequiredAlert}
          handleClose={handleHideAllRequiredAlert}
        />
        <AnswersCompletedAlert
          showAlert={showCompletedAlert}
          nextUrl={nextUrl}
          handleClose={handleHideCompletedAlert}
        />
      </>
    );
  }
}

export default Notifications;

Notifications.propTypes = {
  showAllRequiredAlert: PropTypes.bool,
  showCompletedAlert: PropTypes.bool,
  nextUrl: PropTypes.string,
  handleHideAllRequiredAlert: PropTypes.func,
  handleHideCompletedAlert: PropTypes.func,
};
