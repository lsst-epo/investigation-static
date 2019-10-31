import React from 'react';
import PropTypes from 'prop-types';

class Prompt extends React.PureComponent {
  render() {
    const { question } = this.props;
    const { label } = question;

    return <p>{label}</p>;
  }
}

Prompt.propTypes = {
  question: PropTypes.object,
};

export default Prompt;
