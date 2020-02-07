import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { DropdownMenu, SelectionControl } from 'react-md';
import { checkIds } from '../../../../lib/utilities.js';
import ConditionalWrapper from '../../../ConditionalWrapper';
import Card from '../../../site/card';
import styles from './qaMultiSelect.module.scss';
import CheckBox from '../../../site/icons/CheckBox';
import CheckBoxOutlineBlank from '../../../site/icons/CheckBoxOutlineBlank';

class QAMultiSelect extends React.PureComponent {
  constructor(props) {
    super(props);

    const { answer } = props;
    const { data } = answer || {};

    this.state = {
      hasFocus: false,
      answerable: false,
      selectedOptions: data || [],
      selectedValue: '',
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

  handleChange = e => {
    const {
      question,
      handleAnswerSelect,
      focusCallback,
      saveHandler,
    } = this.props;
    this.setState(
      prevState => ({
        ...prevState,
        hasFocus: e,
      }),
      () => {
        if (focusCallback) {
          const { hasFocus } = this.state;
          focusCallback(hasFocus);
        }
        if (!e) {
          const { selectedOptions } = this.state;
          handleAnswerSelect(question.id, selectedOptions, e);
        }
        saveHandler();
      }
    );
  };

  handleStoredOptions = e => {
    const { checked, value } = e.target;
    if ((checked || value) !== undefined) {
      const { selectedOptions } = this.state;
      if (!checked) {
        const index = selectedOptions.indexOf(value);
        selectedOptions.splice(index, 1);
      } else {
        selectedOptions.push(value);
      }
      this.setState(prevState => ({
        ...prevState,
        selectedOptions,
        selectedValue: selectedOptions.join(', '),
      }));
    }
  };

  getMultiSelectOptions = options => {
    const { selectedOptions } = this.state;
    return options.map(option => {
      return (
        <SelectionControl
          key={`${option.label}_${option.value}`}
          id={`qa-multi-select--${option.value}`}
          checkedCheckboxIcon={<CheckBox />}
          uncheckedCheckboxIcon={<CheckBoxOutlineBlank />}
          name="selectedOptions[]"
          label={option.label}
          type="checkbox"
          defaultChecked={selectedOptions.indexOf(option.value) > -1}
          value={option.value}
          onClick={this.handleStoredOptions}
        />
      );
    });
  };

  render() {
    const { ids, question, activeId, answer } = this.props;
    const {
      id,
      label,
      labelPre,
      labelPost,
      options,
      placeholder,
      questionType,
    } = question;

    const active = ids ? checkIds(ids, activeId) : activeId === id;
    const { hasFocus, answerable, selectedOptions } = this.state;
    const answered = !isEmpty(answer);
    const cardClasses = classnames('qa-card', { active: hasFocus });
    const selectClasses = classnames('qa-multi-select', {
      answered,
      unanswered: !answered,
      answerable: answerable || answered || active,
      'inline-select': labelPre || labelPost,
    });

    return (
      <ConditionalWrapper
        condition={questionType !== 'compoundSelect'}
        wrapper={children => <Card className={cardClasses}>{children}</Card>}
      >
        <div className={selectClasses}>
          {labelPre && <span className="label-pre">{labelPre}&nbsp;</span>}
          <DropdownMenu
            id="multi-select"
            className={styles.multiSelectDropdown}
            listStyle={{ paddingRight: '10px' }}
            menuItems={this.getMultiSelectOptions(options)}
            toggleQuery=".multi-select--options"
            onVisibilityChange={this.handleChange}
            anchor={{
              x: DropdownMenu.HorizontalAnchors.INNER_LEFT,
              y: DropdownMenu.VerticalAnchors.BOTTOM,
            }}
            position={DropdownMenu.Positions.BELOW}
            // visible={answerable}
          >
            <span
              label={label}
              className={classnames(
                'multi-select--options',
                styles.selectedOptions
              )}
            >
              {selectedOptions.join(', ') || placeholder}
            </span>
          </DropdownMenu>
          {labelPost && (
            <span className="label-pre">&nbsp;{labelPost}&nbsp;</span>
          )}
        </div>
      </ConditionalWrapper>
    );
  }
}

QAMultiSelect.propTypes = {
  handleAnswerSelect: PropTypes.func,
  question: PropTypes.object,
  answer: PropTypes.object,
  activeId: PropTypes.string,
  ids: PropTypes.array,
  focusCallback: PropTypes.func,
  saveHandler: PropTypes.func,
};

export default QAMultiSelect;
