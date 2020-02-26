import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from '../../../lib/utilities';

function WidgetsBlock({ col, row, styles, props }) {
  const {
    widgets,
    WidgetTags,
    questions,
    answers,
    updateAnswer,
    activeAnswer,
    advanceActiveQuestion,
    setActiveQuestion,
    activeQuestionId,
  } = props;

  if (!widgets) return null;

  return widgets.map((widget, i) => {
    const { layout, options } = widget;
    const { row: widgetRow, col: widgetCol } = layout || {};
    const COLUMN = col || 'right';
    const ROW = row || 'bottom';

    if (
      WidgetTags[i] &&
      COLUMN === (widgetCol || 'right') &&
      ROW === (widgetRow || 'bottom')
    ) {
      const WidgetTag = WidgetTags[i];
      const key = `${widgetRow}_${widgetCol}_${i}`;

      return (
        <div
          key={key}
          className={styles[`gridWidget${capitalize(widgetRow || 'bottom')}`]}
        >
          <WidgetTag
            {...{
              questions,
              answers,
              updateAnswer,
              activeAnswer,
              advanceActiveQuestion,
              setActiveQuestion,
              activeQuestionId,
              widget,
              options,
            }}
          />
        </div>
      );
    }
    return null;
  });
}

WidgetsBlock.propTypes = {
  row: PropTypes.string,
  col: PropTypes.string,
  styles: PropTypes.object,
  props: PropTypes.object,
};

export default WidgetsBlock;
