/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import QAs from '../qas';
import { renderDef } from '../../lib/utilities.js';
import ObservationsTables from '../charts/shared/observationsTables/ObservationsTables';
import Placeholder from '../placeholder';
import styles from './page.module.scss';
import ImagesBlock from './shared/imagesBlock';
import WidgetsBlock from './shared/widgetsBlock';

class TwoCol extends React.PureComponent {
  isPosEmpty = (layout = { col: 'right', row: 'bottom' }, targets) => {
    return !find(targets, target => {
      const { col, row } = layout;
      const { layout: targetLayout } = target || {};
      const { col: targetCol, row: targetRow } = targetLayout || layout;
      return targetCol === col || targetRow === row;
    });
  };

  render() {
    const {
      title,
      content,
      questions,
      answers,
      tables,
      images,
      widgets,
    } = this.props;

    return (
      <div className="container-flex spaced">
        <div className="col padded col-width-50">
          <div className={styles.leftColGrid}>
            <h1 className={`space-bottom section-title ${styles.gridTitle}`}>
              {title}
            </h1>
            <div
              className={styles.gridCopy}
              dangerouslySetInnerHTML={renderDef(content)}
            />
            <ImagesBlock getRow="top" getCol="left" {...{ images, styles }} />
            <WidgetsBlock
              getRow="top"
              getCol="left"
              {...{ styles, widgetProps: this.props }}
            />
            <ObservationsTables
              getCol="left"
              getRow="top"
              {...{ tables, answers, styles }}
            />
            <ObservationsTables
              getCol="left"
              getRow="middle"
              {...{ tables, answers, styles }}
            />
            {questions && (
              <div className={styles.gridQas}>
                <QAs {...this.props} />
              </div>
            )}
            <ImagesBlock
              getRow="bottom"
              getCol="left"
              {...{ images, styles }}
            />
            <WidgetsBlock
              getRow="bottom"
              getCol="left"
              {...{ styles, widgetProps: this.props }}
            />
            <ObservationsTables
              getCol="left"
              getRow="bottom"
              {...{ tables, answers, styles }}
            />
          </div>
        </div>
        <div
          className={`col padded col-width-50 col-fixed ${styles.rightColGrid}`}
        >
          <ImagesBlock getRow="top" getCol="right" {...{ images, styles }} />
          <WidgetsBlock
            getRow="top"
            getCol="right"
            {...{ styles, widgetProps: this.props }}
          />
          <ObservationsTables
            getCol="right"
            getRow="top"
            {...{ tables, answers, styles }}
          />
          <ImagesBlock getRow="bottom" getCol="right" {...{ images, styles }} />
          <WidgetsBlock
            getRow="bottom"
            getCol="right"
            {...{ styles, widgetProps: this.props }}
          />
          <ObservationsTables
            getCol="right"
            getRow="bottom"
            {...{ tables, answers, styles }}
          />
          {this.isPosEmpty({ col: 'right' }, [
            ...(tables || []),
            ...(images || []),
            ...(widgets || []),
          ]) && (
            <div className={styles.gridPlaceholder}>
              <Placeholder />
            </div>
          )}
        </div>
      </div>
    );
  }
}

TwoCol.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  WidgetTags: PropTypes.array,
  widgets: PropTypes.array,
  images: PropTypes.array,
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

export default TwoCol;
