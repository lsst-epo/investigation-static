/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import QAs from '../qas';
import { renderDef } from '../../lib/utilities.js';
import ObservationsTables from '../charts/shared/observationsTables/ObservationsTables';
import Placeholder from '../placeholder';
import styles from './page.module.scss';
import Images from './shared/images';

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

  renderImages = () => {
    return <Images {...this.props} classname={styles.gridImage} />;
  };

  render() {
    const {
      title,
      content,
      questions,
      answers,
      WidgetTag,
      widget,
      tables,
    } = this.props;
    const { layout } = widget || {};
    const { row: widgetRow, col: widgetCol } = layout || {};
    const leftColTables = this.filterTables('left', tables);
    const rightColTables = this.filterTables('right', tables);
    const images = this.renderImages();

    return (
      <div className="container-flex spaced">
        <div className="col padded col-width-50">
          <div className={styles.leftColGrid}>
            {/* <section> */}
            <h1 className={`space-bottom section-title ${styles.gridTitle}`}>
              {title}
            </h1>
            {widgetCol === 'left' && widgetRow === 'top' && WidgetTag && (
              <div className={styles[`gridWidget${widgetRow}`]}>
                <WidgetTag {...this.props} />
              </div>
            )}
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
            {widgetCol === 'left' && widgetRow === 'bottom' && WidgetTag && (
              <div className={styles[`gridWidget${widgetRow}`]}>
                <WidgetTag {...this.props} />
              </div>
            )}
            {/* </section> */}
          </div>
        </div>
        <div
          className={`col padded col-width-50 col-fixed ${styles.rightColGrid}`}
        >
          {widgetCol === 'right' && widgetRow === 'top' && WidgetTag && (
            <div className={styles[`gridWidget${widgetRow}`]}>
              <WidgetTag {...this.props} />
            </div>
          )}
          {!WidgetTag && !rightColTables && (
            <div className={styles.gridPlaceholder}>
              <Placeholder />
            </div>
          )}
          {rightColTables && (
            <ObservationsTables answers={answers} tables={rightColTables} />
          )}
          {images}
          {widgetCol === 'right' &&
            (widgetRow === 'bottom' || !widgetRow) &&
            WidgetTag && (
              <div className={styles[`gridWidget${widgetRow}`]}>
                <WidgetTag {...this.props} />
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default TwoCol;

TwoCol.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  WidgetTag: PropTypes.func,
  images: PropTypes.array,
  widget: PropTypes.object,
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
