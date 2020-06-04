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
    const { ids, question, activeId, answer } = this.props;
    const {
      id,
      label,
      srLabel,
      labelPre,
      labelPost,
      options,
      placeholder,
      questionType,
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
    });

    return (
      <ConditionalWrapper
        condition={!includes(questionType, 'compound', 'compoundSelect')}
        wrapper={children => <Card className={cardClasses}>{children}</Card>}
      >
        <div className={wrapperClasses}>
          {labelPre && (
            <span className={styles.labelPre}>{labelPre}&nbsp;</span>
          )}
          <Select
            id={`qa-select-${id}`}
            options={options}
            label={label || srLabel}
            name={label || srLabel}
            value={answered ? answer.content || answer.data : 'DEFAULT'}
            handleBlur={this.handler}
            handleChange={this.handler}
            handleFocus={this.handler}
            placeholder={placeholder}
            disabled={!(answerable || answered || active)}
            showLabel={!!label}
            inline={!!labelPre || !!labelPost}
          />
          {labelPost && (
            <span className={styles.labelPost}>&nbsp;{labelPost}&nbsp;</span>
          )}
        </div>
      </ConditionalWrapper>
    );
  }
}

QASelect.propTypes = {
  handleAnswerSelect: PropTypes.func,
  question: PropTypes.object,
  answer: PropTypes.object,
  activeId: PropTypes.string,
  ids: PropTypes.array,
  focusCallback: PropTypes.func,
};

export default QASelect;
