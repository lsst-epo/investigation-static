import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import Select from '../../../site/forms/select';
import './qaSelect.module.scss';

class QASelect extends React.PureComponent {
  onChange = e => {
    const { question, handleAnswerSelect } = this.props;
    const { value } = e.target;

    handleAnswerSelect(question.id, value, e.type);
  };

  checkIds(ids, activeId) {
    let active = false;
    let i = 0;

    while (i < ids.length) {
      if (activeId === ids[i]) {
        active = true;
      }

      i += 1;
    }

    return active;
  }

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
    } = question;

    const active = ids ? this.checkIds(ids, activeId) : activeId === id;
    const answered = !isEmpty(answer);
    const classes = classnames('qa-select', {
      active,
      answered,
      unanswered: !answered,
      'inline-select': labelPre || labelPost,
    });

    return (
      <div className={classes}>
        {labelPre && <span className="label-pre">{labelPre}&nbsp;</span>}
        <Select
          id={`qa-${id}`}
          className="answer-select"
          options={options}
          label={label || srLabel}
          name={label || srLabel}
          value={answered ? answer.content : 'DEFAULT'}
          handleBlur={this.onChange}
          handleChange={this.onChange}
          placeholder={placeholder}
          disabled={!active && !answered}
          showLabel={!!label}
        />
        {labelPost && (
          <span className="label-pre">&nbsp;{labelPost}&nbsp;</span>
        )}
      </div>
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
