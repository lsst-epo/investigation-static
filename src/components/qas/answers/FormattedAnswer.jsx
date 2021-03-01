/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import includes from 'lodash/includes';
import isNumber from 'lodash/isNumber';
import StellarValue from '../../charts/shared/StellarValue';
import StellarValueRange from '../../charts/shared/StellarValueRange';
import { renderDef } from '../../../lib/utilities.js';
import { answerContent } from '../styles.module.scss';

class FormattedAnswer extends React.PureComponent {
  renderRange(type, body, qaReview) {
    const answerClasses = classnames('answer-content', {
      [answerContent]: qaReview,
    });
    return (
      <span className={answerClasses}>
        <StellarValueRange type={type.split(' range')[0]} data={body} />
      </span>
    );
  }

  renderSingle(type, body, qaReview) {
    const answerClasses = classnames('answer-content', {
      [answerContent]: qaReview,
    });
    if (isNumber(body)) {
      return (
        <span className={answerClasses}>
          <StellarValue type={type} value={body} />
        </span>
      );
    }
    return (
      <span className={answerClasses}>
        <span>{body}</span>
      </span>
    );
  }

  render() {
    const { pre, post, type, body, qaReview } = this.props;

    const answerPreClasses = classnames('answer-pre', {
      [answerContent]: qaReview,
    });
    const answerPostClasses = classnames('answer-post', {
      [answerContent]: qaReview,
    });

    return (
      <>
        {pre && (
          <span
            className={answerPreClasses}
            dangerouslySetInnerHTML={renderDef(pre)}
          />
        )}
        {includes(type, 'range')
          ? this.renderRange(type, body)
          : this.renderSingle(type, body)}
        {post && (
          <span
            className={answerPostClasses}
            dangerouslySetInnerHTML={renderDef(post)}
          />
        )}
      </>
    );
  }
}

FormattedAnswer.propTypes = {
  type: PropTypes.string,
  pre: PropTypes.string,
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  post: PropTypes.string,
  qaReview: PropTypes.bool,
};

export default FormattedAnswer;
