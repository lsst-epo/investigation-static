/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../site/card';
import { renderDef } from '../../../lib/utilities.js';

class Prompt extends React.PureComponent {
  render() {
    const { question } = this.props;
    const { label } = question;

    return (
      <Card className="qa-card active">
        <div dangerouslySetInnerHTML={renderDef(label)} />
      </Card>
    );
  }
}

Prompt.propTypes = {
  question: PropTypes.object,
};

export default Prompt;
