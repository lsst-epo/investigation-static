/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '../../site/card';
import { renderDef } from '../../../lib/utilities.js';
import { qaPrompt, qaLabel } from './prompt.module.scss';
import {
  qaCard,
  active,
  labelWithNumber,
  qaReviewNoActiveState,
  qaReviewLabel,
} from '../styles.module.scss';

class Prompt extends React.PureComponent {
  render() {
    const { question, questionNumber } = this.props;
    const { label, qaReview } = question;
    const cardClasses = classnames(qaCard, qaPrompt, {
      [active]: !qaReview,
      [qaReviewNoActiveState]: qaReview,
    });
    const updatedLabel = questionNumber ? `${questionNumber}. ${label}` : label;
    const labelClasses = classnames(labelWithNumber, qaLabel, {
      [qaReviewLabel]: qaReview,
    });

    return (
      <Card className={cardClasses}>
        <div
          className={labelClasses}
          dangerouslySetInnerHTML={renderDef(`<span>${updatedLabel}</span>`)}
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
