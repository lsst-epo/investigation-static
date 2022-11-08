/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import classnames from 'classnames';
import { withTranslation } from 'gatsby-plugin-react-i18next';
import TextField from '../../../site/forms/textField';
import Card from '../../../site/card';
import ConditionalWrapper from '../../../ConditionalWrapper';
import { renderDef, checkIds } from '../../../../lib/utilities.js';
import styles from './styles.module.scss';
import qaStyles from '../../styles.module.scss';

class TextInput extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: undefined,
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

  handleChange = value => {
    const { question, answerHandler } = this.props;
    const { id } = question;
    const { value: oldValue } = this.state;

    if (!oldValue) {
      answerHandler(id, value, 'change');
    }

    this.setState(prevState => ({
      ...prevState,
      value,
    }));
  };

  updateFocus(focusStatus) {
    const { question, focusCallback, answerHandler } = this.props;
    const { id } = question;
    const { value } = this.state;

    answerHandler(id, value || ' ', focusStatus ? 'focus' : 'blur');

    this.setState(
      prevState => ({
        ...prevState,
        hasFocus: focusStatus,
      }),
      () => {
        if (focusCallback) {
          const { hasFocus } = this.state;
          focusCallback(hasFocus);
        }
      }
    );
  }

  handleBlur = () => {
    this.updateFocus(false);
  };

  handleFocus = () => {
    this.updateFocus(true);
  };

  render() {
    const {
      firstQuestion,
      question,
      questionNumber,
      answer,
      activeId,
      t,
    } = this.props;
    const { hasFocus, answerable } = this.state;
    const {
      id,
      questionType,
      label,
      placeholder,
      labelPre,
      labelPost,
      qaReview,
    } = question;
    const isTextArea = questionType === 'textArea';
    const rows = isTextArea ? { rows: 1, maxRows: 8 } : {};
    const active = activeId === id;
    const answered = !isEmpty(answer);
    const cardClasses = classnames(qaStyles.qaCard, {
      [qaStyles.active]: hasFocus,
    });
    const labelClasses = classnames(styles.label, qaStyles.labelWithNumber, {
      answered,
      unanswered: !answered,
      [styles.answerable]: answerable || answered || active,
    });
    const fieldClasses = classnames(styles.qaTextInput, {
      answered,
      unanswered: !answered,
      [styles.answerable]: answerable || answered || active,
      answerable: answerable || answered || active,
      [styles.inlineInput]: labelPre || labelPost,
    });

    const hasQANumber = questionNumber && firstQuestion;
    const updatedLabel =
      hasQANumber && label && !labelPre
        ? `${questionNumber}. ${t(label)}`
        : t(label);
    const updatedLabelPre =
      hasQANumber && !label && labelPre
        ? `${questionNumber}. ${t(labelPre)}`
        : t(labelPre);
    const onlyQaNumber =
      hasQANumber && !labelPre && !label && labelPost
        ? `${questionNumber}. `
        : null;

    return (
      <ConditionalWrapper
        condition={!includes(questionType, 'compoundInput')}
        wrapper={children => <Card className={cardClasses}>{children}</Card>}
      >
        {updatedLabelPre && (
          <>
            <span
              className={labelClasses}
              dangerouslySetInnerHTML={renderDef(updatedLabelPre)}
            ></span>
            <span>&nbsp;</span>
          </>
        )}
        {onlyQaNumber && !updatedLabelPre && (
          <span className={styles.labelPre}>{onlyQaNumber}&nbsp;</span>
        )}
        {qaReview && (
          <span className={qaStyles.qaReviewBlock}>
            <span
              className={qaStyles.answerLabel}
              dangerouslySetInnerHTML={renderDef(updatedLabel)}
            />
            <span
              className={classnames(qaStyles.answerContent, {
                [qaStyles.qaReviewInlineInput]: labelPre || labelPost,
                [qaStyles.qaReviewBlockInput]: !labelPre && !labelPost,
              })}
            >
              {answered ? answer.content : t('errors.qas.answer_not_provided')}
            </span>
          </span>
        )}
        {!qaReview && (
          <TextField
            id={`text-${isTextArea ? 'area' : 'input'}-${id}`}
            className={fieldClasses}
            type="text"
            label={
              <div
                className={qaStyles.labelWithNumber}
                dangerouslySetInnerHTML={renderDef(
                  updatedLabel ||
                    t('qas.text_input.label', { labelPre, labelPost })
                )}
              />
            }
            lineDirection="center"
            fullWidth={!(labelPre || labelPost)}
            placeholder={t(placeholder)}
            {...rows}
            defaultValue={answered ? answer.content : ''}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={this.handleChange}
            disabled={!(answerable || answered || active)}
          />
        )}
        {labelPost && (
          <span className={labelClasses}>&nbsp;{t(labelPost)}&nbsp;</span>
        )}
      </ConditionalWrapper>
    );
  }
}

TextInput.defaultProps = {
  firstQuestion: true,
};

TextInput.propTypes = {
  activeId: PropTypes.string,
  firstQuestion: PropTypes.bool,
  questionNumber: PropTypes.number,
  question: PropTypes.object,
  focusCallback: PropTypes.func,
  answerHandler: PropTypes.func,
  answer: PropTypes.object,
  ids: PropTypes.array,
  t: PropTypes.func,
};

export default withTranslation('interface')(TextInput);
