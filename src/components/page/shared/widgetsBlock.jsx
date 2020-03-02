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

  const defaultLayout = {
    col: 'right',
    row: 'bottom',
  };

  if (!widgets) return null;

  return widgets.map((widget, i) => {
    const { layout, options } = widget;
    const { col: dCol, row: dRow } = defaultLayout;
    const { row: widgetRow, col: widgetCol } = layout || defaultLayout;
    const COLUMN = col || dCol;
    const ROW = row || dRow;

    if (
      WidgetTags[i] &&
      COLUMN === (widgetCol || dCol) &&
      ROW === (widgetRow || dRow)
    ) {
      const WidgetTag = WidgetTags[i];
      const key = `${widgetRow}_${widgetCol}_${i}`;

      return (
        <div
          key={key}
          className={styles[`gridWidget${capitalize(widgetRow || dRow)}`]}
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
