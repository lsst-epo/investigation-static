/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import QAs from '../qas';
import { renderDef } from '../../lib/utilities.js';
import ObservationsTables from '../charts/shared/observationsTables/ObservationsTables';
import ImagesBlock from './shared/imagesBlock';
import WidgetsBlock from './shared/widgetsBlock';
import styles from './page.module.scss';

class Page extends React.PureComponent {
  render() {
    const { title, content, questions, answers, tables, images } = this.props;

    return (
      <div className={styles.singleColGrid}>
        <h1 className={`space-bottom section-title ${styles.gridTitle}`}>
          {title}
        </h1>
        <ImagesBlock getRow="top" getCol="left" {...{ images, styles }} />
        <div
          className={styles.gridCopy}
          dangerouslySetInnerHTML={renderDef(content)}
        />
        <WidgetsBlock
          getRow="top"
          getCol="left"
          {...{ styles, widgetProps: this.props }}
        />
        <ObservationsTables
          getRow="top"
          getCol="left"
          {...{ tables, answers, styles }}
        />
        {questions && (
          <div className={styles.gridQas}>
            <QAs {...this.props} />
          </div>
        )}
        <ObservationsTables
          getRow="middle"
          getCol="left"
          {...{ tables, answers, styles }}
        />
        <WidgetsBlock
          getRow="bottom"
          getCol="left"
          {...{ styles, widgetProps: this.props }}
        />
        <ImagesBlock getRow="bottom" getCol="left" {...{ images, styles }} />
        <ObservationsTables
          getRow="bottom"
          getCol="left"
          {...{ tables, answers, styles }}
        />
      </div>
    );
  }
}

export default Page;

Page.propTypes = {
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
