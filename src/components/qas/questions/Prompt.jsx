/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../site/card';
import { renderDef } from '../../../lib/utilities.js';
import { qaPrompt } from './prompt.module.scss';
import { qaCard, active, labelWithNumber } from '../styles.module.scss';

class Prompt extends React.PureComponent {
  render() {
    const { question, questionNumber } = this.props;
    const { label } = question;

    const updatedLabel = questionNumber ? `${questionNumber}. ${label}` : label;

    return (
      <Card className={`${qaCard} ${active} ${qaPrompt}`}>
        <div
          className={labelWithNumber}
          dangerouslySetInnerHTML={renderDef(updatedLabel)}
        />
      </Card>
    );
  }
}

Prompt.propTypes = {
  question: PropTypes.object,
  questionNumber: PropTypes.number,
};

export default Prompt;
