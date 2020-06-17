import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { message, open, messageText } from './galaxy-selector.module.scss';

class Message extends React.PureComponent {
  constructor(props) {
    super(props);
    this.timerFunc = null;
  }

  componentDidUpdate() {
    const { visible, toggler } = this.props;
    clearTimeout(this.timerFunc);

    if (visible) {
      this.timerFunc = setTimeout(toggler, 2000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timerFunc);
  }

  render() {
    const { response, visible } = this.props;
    return (
      <div className={classnames(message, { [open]: visible })}>
        <div className={messageText}>{response}</div>
      </div>
    );
  }
}

Message.propTypes = {
  toggler: PropTypes.func,
  response: PropTypes.string,
  visible: PropTypes.bool,
};

export default Message;
