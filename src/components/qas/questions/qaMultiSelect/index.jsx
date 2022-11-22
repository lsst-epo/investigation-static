import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { withTranslation } from 'gatsby-plugin-react-i18next';
import { DropdownMenu, SelectionControl } from 'react-md';
import { checkIds } from '../../../../lib/utilities.js';
import ConditionalWrapper from '../../../ConditionalWrapper';
import Card from '../../../site/card';
import CheckBox from '../../../site/icons/CheckBox';
import CheckBoxOutlineBlank from '../../../site/icons/CheckBoxOutlineBlank';
import styles from './qaMultiSelect.module.scss';
import qaStyles from '../../styles.module.scss';

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
    const { t } = this.props;
    const { selectedOptions } = this.state;
    return options.map(option => {
      const { label, value } = option;
      const translatedLabel = t(label);
      return (
        <SelectionControl
          key={`${translatedLabel}_${value}`}
          id={`qa-multi-select-${value}`}
          checkedCheckboxIcon={<CheckBox />}
          uncheckedCheckboxIcon={<CheckBoxOutlineBlank />}
          name="selectedOptions[]"
          label={translatedLabel}
          type="checkbox"
          defaultChecked={selectedOptions.indexOf(value) > -1}
          value={value}
          onClick={this.handleStoredOptions}
        />
      );
    });
  };

  render() {
    const {
      ids,
      firstQuestion,
      questionNumber,
      question,
      activeId,
      answer,
      t,
    } = this.props;
    const {
      id,
      label,
      labelPre,
      labelPost,
      options,
      placeholder,
      questionType,
      qaReview,
    } = question;

    const active = ids ? checkIds(ids, activeId) : activeId === id;
    const { hasFocus, answerable, selectedOptions } = this.state;
    const answered = !isEmpty(answer);
    const cardClasses = classnames(qaStyles.qaCard, {
      [qaStyles.active]: hasFocus,
    });
    const selectClasses = classnames(styles.qaMultiSelect, {
      answered,
      unanswered: !answered,
      [styles.answerable]: answerable || answered || active,
      [qaStyles.qaReviewNoActiveState]: qaReview,
    });
    const labelPreClasses = classnames(styles.labelPre, {
      [qaStyles.qaReviewLabelPre]: qaReview,
    });
    const labelPostClasses = classnames(styles.labelPost, {
      [qaStyles.qaReviewLabelPost]: qaReview,
    });

    const labelToUse = t(!isEmpty(labelPre) ? labelPre : label);
    const updatedLabelPre =
      questionNumber && firstQuestion
        ? `${questionNumber}. ${labelToUse}`
        : labelToUse;

    return (
      <ConditionalWrapper
        condition={questionType !== 'compoundSelect'}
        wrapper={children => <Card className={cardClasses}>{children}</Card>}
      >
        <div className={selectClasses}>
          {labelToUse && (
            <span className={labelPreClasses}>{updatedLabelPre}&nbsp;</span>
          )}
          {qaReview && (
            <span className={qaStyles.qaReviewBlock}>
              <span className={qaStyles.answerContentSelect}>
                {selectedOptions.map(t).join(', ') ||
                  t('interface::errors.qas.answer_not_selected')}
              </span>
            </span>
          )}
          {!qaReview && (
            <DropdownMenu
              id="multi-select"
              className={styles.multiSelectDropdown}
              listStyle={{ left: 0, top: 0 }}
              menuItems={this.getMultiSelectOptions(options)}
              toggleQuery=".toggle"
              onVisibilityChange={this.handleChange}
              anchor={{
                x: DropdownMenu.HorizontalAnchors.CENTER,
                y: DropdownMenu.VerticalAnchors.OVERLAP,
              }}
              position={DropdownMenu.Positions.TOP_LEFT}
              simplifiedMenu={false}
              animationPosition="below"
              sameWidth={!isEmpty(label)}
              listInline
              fullWidth={!isEmpty(label)}
            >
              <span
                className={classnames(
                  'toggle',
                  styles.multiSelectOptions,
                  styles.selectedOptions,
                  { [styles.fullWidthSelect]: !isEmpty(label) }
                )}
              >
                {selectedOptions.join(', ') || t(placeholder)}
              </span>
            </DropdownMenu>
          )}
          {labelPost && (
            <span className={labelPostClasses}>&nbsp;{t(labelPost)}&nbsp;</span>
          )}
        </div>
      </ConditionalWrapper>
    );
  }
}

QAMultiSelect.defaultProps = {
  firstQuestion: true,
};

QAMultiSelect.propTypes = {
  handleAnswerSelect: PropTypes.func,
  firstQuestion: PropTypes.bool,
  questionNumber: PropTypes.number,
  question: PropTypes.object,
  answer: PropTypes.object,
  activeId: PropTypes.string,
  ids: PropTypes.array,
  focusCallback: PropTypes.func,
  saveHandler: PropTypes.func,
  t: PropTypes.func,
};

export default withTranslation()(QAMultiSelect);
