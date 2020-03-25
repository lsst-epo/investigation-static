/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../site/card';
import { renderDef } from '../../../lib/utilities.js';
import { qaPrompt } from './prompt.module.scss';

class Prompt extends React.PureComponent {
  render() {
    const { question } = this.props;
    const { label } = question;

    return (
      <Card className={`qa-card active ${qaPrompt}`}>
        <div dangerouslySetInnerHTML={renderDef(label)} />
      </Card>
    );
  }
}

Prompt.propTypes = {
  question: PropTypes.object,
};

export default Prompt;
