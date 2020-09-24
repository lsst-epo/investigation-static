/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '../../site/card';
import { renderDef } from '../../../lib/utilities.js';
import { qaPrompt, qaLabel } from './prompt.module.scss';
import { qaCard, active, labelWithNumber } from '../styles.module.scss';

class Prompt extends React.PureComponent {
  render() {
    const { question, questionNumber } = this.props;
    const { label } = question;
    const cardClasses = classnames(qaCard, active, qaPrompt);
    const updatedLabel = questionNumber ? `${questionNumber}. ${label}` : label;

    return (
      <Card className={cardClasses}>
        <div
          className={`${labelWithNumber} ${qaLabel}`}
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
