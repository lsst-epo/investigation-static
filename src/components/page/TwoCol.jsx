/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import QAs from '../qas';
import { renderDef } from '../../lib/utilities.js';
import ObservationsTables from '../charts/shared/observationsTables/ObservationsTables';
import Placeholder from '../placeholder';
import styles from './page.module.scss';
import ImagesBlock from './shared/imagesBlock';
import WidgetsBlock from './shared/widgetsBlock';

class TwoCol extends React.PureComponent {
  defaultLayout = { col: 'right', row: 'bottom' };

  isPosEmpty = (layout, ...widgets) => {
    return !_.find(...widgets, widget => {
      const { col, row } = layout || {};
      const { layout: wLayout } = widget || {};
      const { col: wCol, row: wRow } = wLayout || this.defaultLayout;
      return (wCol && wCol === col) || (wRow && wRow === row);
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

    const rightColEmpty = this.isPosEmpty(
      { col: 'right' },
      { ...tables, ...images, ...widgets }
    );

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
            <ImagesBlock row="top" col="left" {...{ images, styles }} />
            <WidgetsBlock
              row="top"
              col="left"
              {...{ styles, props: this.props }}
            />
            <ObservationsTables
              col="left"
              row="top"
              {...{ tables, answers, styles }}
            />
            <ObservationsTables
              col="left"
              row="middle"
              {...{ tables, answers, styles }}
            />
            {questions && (
              <div className={styles.gridQas}>
                <QAs {...this.props} />
              </div>
            )}
            <ImagesBlock row="bottom" col="left" {...{ images, styles }} />
            <WidgetsBlock
              row="bottom"
              col="left"
              props={this.props}
              {...{ styles }}
            />
            <ObservationsTables
              col="left"
              row="bottom"
              {...{ tables, answers, styles }}
            />
          </div>
        </div>
        <div
          className={`col padded col-width-50 col-fixed ${styles.rightColGrid}`}
        >
          <ImagesBlock row="top" col="right" {...{ images, styles }} />
          <WidgetsBlock
            row="top"
            col="right"
            {...{ styles, props: this.props }}
          />
          <ObservationsTables
            col="right"
            row="top"
            {...{ tables, answers, styles }}
          />
          <ImagesBlock row="bottom" col="right" {...{ images, styles }} />
          <WidgetsBlock
            row="bottom"
            col="right"
            {...{ styles, props: this.props }}
          />
          <ObservationsTables
            col="right"
            row="bottom"
            {...{ tables, answers, styles }}
          />
          {rightColEmpty && (
            <div className={styles.gridPlaceholder}>
              <Placeholder />
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
