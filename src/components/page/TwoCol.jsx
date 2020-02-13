/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import QAs from '../qas';
import { renderDef, capitalize } from '../../lib/utilities.js';
import ObservationsTables from '../charts/shared/observationsTables/ObservationsTables';
import Placeholder from '../placeholder';
import styles from './page.module.scss';
import ImageBlock from './shared/imageBlock';

class TwoCol extends React.PureComponent {
  filterTables(side, tables) {
    if (!tables) return null;

    return tables.filter(table => {
      const { position } = table;

      if (includes(position, side) || (side !== 'left' && !position)) {
        return table;
      }

      return null;
    });
  }

  renderImages = (row, col) => {
    const { images } = this.props;
    const uRow = row || 'bottom';
    const uCol = col || 'right';
    const img =
      images &&
      images.map((image, i) => {
        const { layout } = image;
        const { row: iRow, col: iCol } = layout || {};
        const COL = iCol || 'right';
        const ROW = iRow || 'bottom';
        return (
          uCol === COL &&
          uRow === ROW && (
            <ImageBlock
              // eslint-disable-next-line react/no-array-index-key
              key={image.altText + i}
              {...{ image }}
              classname={styles[`gridImage${capitalize(ROW)}`]}
            />
          )
        );
      });
    return img;
  };

  renderWidgets = (row, col) => {
    const { widgets, WidgetTags } = this.props;
    const uRow = row || 'bottom';
    const uCol = col || 'right';
    const widget =
      widgets &&
      widgets.map((w, i) => {
        const { layout } = w;
        const { row: wRow, col: wCol } = layout || {};
        const COL = wCol || 'right';
        const ROW = wRow || 'bottom';
        const WidgetTag = WidgetTags[i] || {};
        return (
          uCol === COL &&
          uRow === ROW && (
            <WidgetTag
              // eslint-disable-next-line react/no-array-index-key
              key={w.altText + i}
              {...{ widget: w }}
              classname={styles[`gridWidget${capitalize(ROW)}`]}
            />
          )
        );
      });
    return widget;
  };

  render() {
    const {
      title,
      content,
      questions,
      answers,
      tables,
      WidgetTags,
    } = this.props;
    const leftColTables = this.filterTables('left', tables);
    const rightColTables = this.filterTables('right', tables);

    const widgetTopLeft = this.renderWidgets('top', 'left');
    const widgetMiddleLeft = this.renderWidgets('middle', 'left');
    const widgetBottomLeft = this.renderWidgets('bottom', 'left');
    const widgetTopRight = this.renderWidgets('top', 'right');
    const widgetBottomRight = this.renderWidgets('bottom', 'right');

    const imageLeftTop = this.renderImages('top', 'left');
    const imageLeftBottom = this.renderImages('bottom', 'left');
    const imageRightTop = this.renderImages('top', 'right');
    const imageRightBottom = this.renderImages('bottom', 'right');

    return (
      <div className="container-flex spaced">
        <div className="col padded col-width-50">
          <div className={styles.leftColGrid}>
            <h1 className={`space-bottom section-title ${styles.gridTitle}`}>
              {title}
            </h1>
            {imageLeftTop}
            {widgetTopLeft}
            <div
              className={styles.gridCopy}
              dangerouslySetInnerHTML={renderDef(content)}
            />
            {leftColTables && (
              <ObservationsTables answers={answers} tables={leftColTables} />
            )}
            {questions && (
              <div className={styles.gridQas}>
                <QAs {...this.props} />
              </div>
            )}
            {widgetMiddleLeft}
            {imageLeftBottom}
            {widgetBottomLeft}
            {/* </section> */}
          </div>
        </div>
        <div
          className={`col padded col-width-50 col-fixed ${styles.rightColGrid}`}
        >
          {imageRightTop}
          {widgetTopRight}
          {!WidgetTags && !rightColTables && (
            <div className={styles.gridPlaceholder}>
              <Placeholder />
            </div>
          )}
          {rightColTables && (
            <ObservationsTables answers={answers} tables={rightColTables} />
          )}
          {imageRightBottom}
          {widgetBottomRight}
        </div>
      </div>
    );
  }
}

export default TwoCol;

TwoCol.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  WidgetTags: PropTypes.array,
  images: PropTypes.array,
  widgets: PropTypes.array,
  options: PropTypes.object,
  questions: PropTypes.array,
  answers: PropTypes.object,
  tables: PropTypes.array,
  activeId: PropTypes.string,
  updateAnswer: PropTypes.func,
  activeAnswer: PropTypes.object,
  activeQuestionId: PropTypes.string,
  advanceActiveQuestion: PropTypes.func,
  setActiveQuestion: PropTypes.func,
};
