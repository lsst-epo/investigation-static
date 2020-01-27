/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import QAs from '../qas';
import { renderDef } from '../../lib/utilities.js';
import ObservationsTables from '../charts/shared/observationsTables/ObservationsTables';
import Placeholder from '../placeholder';
import styles from './page.module.scss';

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

  render() {
    const { title, content, questions, answers, MediaTag, tables } = this.props;
    const leftColTables = this.filterTables('left', tables);
    const rightColTables = this.filterTables('right', tables);
    return (
      <div className="container-flex spaced">
        <div className="col padded col-width-50">
          <div className={styles.leftColGrid}>
            {/* <section> */}
            <h2 className={`section-title ${styles.gridTitle}`}>{title}</h2>
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
            {/* </section> */}
          </div>
        </div>
        <div
          className={`col padded col-width-50 col-fixed ${styles.rightColGrid}`}
        >
          {!MediaTag && !rightColTables && (
            <div className={styles.gridPlaceholder}>
              <Placeholder />
            </div>
          )}
          {rightColTables && (
            <ObservationsTables answers={answers} tables={rightColTables} />
          )}
          {MediaTag && (
            <div className={styles.gridMedia}>
              <MediaTag {...this.props} />
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
  MediaTag: PropTypes.func,
  image: PropTypes.string,
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
