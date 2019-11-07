import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { checkIds } from '../../../../lib/utilities.js';
import ConditionalWrapper from '../../../ConditionalWrapper';
import Card from '../../../site/card';
import Select from '../../../site/forms/select';
import './qaSelect.module.scss';

class QASelect extends React.PureComponent {
  handler = e => {
    const { question, handleAnswerSelect } = this.props;
    const { value } = e.target;

    handleAnswerSelect(question.id, value, e.type);
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
    const answered = !isEmpty(answer);
    const dynamicClasses = {
      active,
      answered,
      unanswered: !answered,
    };
    const cardClasses = classnames('qa-card', dynamicClasses);
    const selectClasses = classnames('qa-select', {
      ...dynamicClasses,
      'inline-select': labelPre || labelPost,
    });

    return (
      <ConditionalWrapper
        condition={questionType !== 'compoundSelect'}
        wrapper={children => <Card className={cardClasses}>{children}</Card>}
      >
        <div className={selectClasses}>
          {labelPre && <span className="label-pre">{labelPre}&nbsp;</span>}
          <Select
            id={`qa-${id}`}
            className="answer-select"
            options={options}
            label={label || srLabel}
            name={label || srLabel}
            value={answered ? answer.content : 'DEFAULT'}
            handleBlur={this.handler}
            handleChange={this.handler}
            handleFocus={this.handler}
            placeholder={placeholder}
            disabled={!active && !answered}
            showLabel={!!label}
          />
          {labelPost && (
            <span className="label-pre">&nbsp;{labelPost}&nbsp;</span>
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
};

export default QASelect;
