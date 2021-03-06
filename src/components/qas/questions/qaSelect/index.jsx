import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import { checkIds } from '../../../../lib/utilities.js';
import ConditionalWrapper from '../../../ConditionalWrapper';
import Card from '../../../site/card';
import Select from '../../../site/forms/select';
import styles from './qaSelect.module.scss';
import qaStyles from '../../styles.module.scss';

class QASelect extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hasFocus: false,
      answerable: false,
    };
  }

  componentDidUpdate() {
    const { answerable } = this.state;
    const { question, activeId, ids } = this.props;
    const { id } = question;
    const active = ids ? checkIds(ids, activeId) : activeId === id;

    this.checkAnswerable(answerable, active);
  }

  checkAnswerable(answerable, active) {
    if (!answerable && active) {
      this.setState(prevState => ({
        ...prevState,
        answerable: true,
      }));
    }
  }

  handler = e => {
    const { question, handleAnswerSelect, focusCallback } = this.props;
    const { value } = e.target;

    if (e.type !== 'blur') {
      handleAnswerSelect(question.id, value, e.type);
    }

    if (e.type === 'blur') {
      this.setState(
        prevState => ({
          ...prevState,
          hasFocus: false,
        }),
        () => {
          if (focusCallback) {
            const { hasFocus } = this.state;
            focusCallback(hasFocus);
          }
        }
      );
    }

    if (e.type === 'focus') {
      this.setState(
        prevState => ({
          ...prevState,
          hasFocus: true,
        }),
        () => {
          if (focusCallback) {
            const { hasFocus } = this.state;
            focusCallback(hasFocus);
          }
        }
      );
    }
  };

  render() {
    const {
      ids,
      firstQuestion,
      question,
      questionNumber,
      activeId,
      answer,
    } = this.props;
    const {
      id,
      label,
      srLabel,
      labelPre,
      labelPost,
      options,
      placeholder,
      questionType,
      qaReview,
    } = question;

    const active = ids ? checkIds(ids, activeId) : activeId === id;
    const { hasFocus, answerable } = this.state;
    const answered = !isEmpty(answer);
    const cardClasses = classnames(qaStyles.qaCard, {
      [qaStyles.active]: hasFocus,
    });
    const wrapperClasses = classnames(styles.qaSelect, {
      [styles.answered]: answered,
      [styles.unanswered]: !answered,
      [styles.answerable]: answerable || answered || active,
      [styles.inlineQaSelect]: labelPre || labelPost,
      [qaStyles.qaReviewNoActiveState]: qaReview,
    });
    const selectClasses = classnames({
      [styles.hideLabel]: labelPre || labelPost,
    });
    const labelPreClasses = classnames(
      styles.labelPre,
      qaStyles.labelWithNumber,
      { [qaStyles.qaReviewLabelPre]: qaReview }
    );
    const labelPostClasses = classnames(styles.labelPost, {
      [qaStyles.qaReviewLabelPost]: qaReview,
    });

    const hasQANumber = questionNumber && firstQuestion;
    const updatedLabel =
      hasQANumber && label && !labelPre ? `${questionNumber}. ${label}` : label;
    const updatedLabelPre =
      hasQANumber && !label && labelPre
        ? `${questionNumber}. ${labelPre}`
        : labelPre;
    const onlyQaNumber =
      hasQANumber && !labelPre && !label && labelPost
        ? `${questionNumber}. `
        : null;

    return (
      <ConditionalWrapper
        condition={!includes(questionType, 'compoundSelect')}
        wrapper={children => <Card className={cardClasses}>{children}</Card>}
      >
        <div className={wrapperClasses}>
          {updatedLabelPre && (
            <span className={labelPreClasses}>
              {updatedLabelPre || onlyQaNumber}&nbsp;
            </span>
          )}
          {onlyQaNumber && !updatedLabelPre && (
            <span className={labelPreClasses}>{onlyQaNumber}&nbsp;</span>
          )}
          {qaReview && (
            <div
              className={classnames(qaStyles.qaReviewBlock, {
                [styles.inlineQaSelect]: !!labelPre || !!labelPost,
              })}
            >
              <span className={selectClasses}>{updatedLabel}</span>
              <div
                className={classnames(qaStyles.answerContentSelect, {
                  [styles.inlineQaSelect]: !!labelPre || !!labelPost,
                })}
              >
                {answered
                  ? answer.content || answer.data
                  : '(nothing selected)'}
              </div>
            </div>
          )}
          {!qaReview && (
            <Select
              id={`qa-select-${id}`}
              className={selectClasses}
              options={options}
              label={updatedLabel || srLabel || placeholder}
              name={label || srLabel || placeholder}
              value={answered ? answer.content || answer.data : 'DEFAULT'}
              handleBlur={this.handler}
              handleChange={this.handler}
              handleFocus={this.handler}
              placeholder={placeholder}
              disabled={!(answerable || answered || active)}
              showLabel={!!label}
              inline={!!labelPre || !!labelPost}
            />
          )}
          {labelPost && (
            <span className={labelPostClasses}>&nbsp;{labelPost}&nbsp;</span>
          )}
        </div>
      </ConditionalWrapper>
    );
  }
}

QASelect.defaultProps = {
  firstQuestion: true,
};

QASelect.propTypes = {
  handleAnswerSelect: PropTypes.func,
  firstQuestion: PropTypes.bool,
  questionNumber: PropTypes.number,
  question: PropTypes.object,
  answer: PropTypes.object,
  activeId: PropTypes.string,
  ids: PropTypes.array,
  focusCallback: PropTypes.func,
};

export default QASelect;
