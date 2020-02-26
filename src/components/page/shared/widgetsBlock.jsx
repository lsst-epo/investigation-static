import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from '../../../lib/utilities';

class WidgetsBlock extends React.PureComponent {
  render() {
    const { getCol, getRow, col, row, styles, widgetProps } = this.props;
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
    } = widgetProps;

    if (!widgets) return null;

    return widgets.map((widget, i) => {
      const { layout, options } = widget;
      const { row: widgetRow, col: widgetCol } = layout || {};

      if (!widget.layout) widget.layout = { col, row };

      if (
        WidgetTags[i] &&
        getCol === (widgetCol || col) &&
        getRow === (widgetRow || row)
      ) {
        const WidgetTag = WidgetTags[i];
        const key = `${widgetRow}_${widgetCol}_${i}`;

        return (
          <div
            key={key}
            className={styles[`gridWidget${capitalize(widgetRow || row)}`]}
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
}

WidgetsBlock.defaultProps = {
  col: 'right',
  row: 'bottom',
};

WidgetsBlock.propTypes = {
  row: PropTypes.string,
  col: PropTypes.string,
  getRow: PropTypes.string,
  getCol: PropTypes.string,
  styles: PropTypes.object,
  widgetProps: PropTypes.object,
};

export default WidgetsBlock;
