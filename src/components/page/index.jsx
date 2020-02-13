/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import QAs from '../qas';
import { renderDef, capitalize } from '../../lib/utilities.js';
import ObservationsTables from '../charts/shared/observationsTables/ObservationsTables';
import ImageBlock from './shared/imageBlock';
import styles from './page.module.scss';

class Page extends React.PureComponent {
  renderImages = row => {
    const { images } = this.props;
    const uRow = row || 'bottom';
    const img =
      images &&
      images.map((image, i) => {
        const { layout } = image;
        const { row: iRow } = layout || {};
        const ROW = iRow || 'bottom';
        return (
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

  renderWidgets = row => {
    const { widgets, WidgetTags } = this.props;
    const uRow = row || 'bottom';
    const widget =
      widgets &&
      widgets.map((w, i) => {
        const { layout } = w;
        const { row: wRow } = layout || {};
        const ROW = wRow || 'bottom';
        const WidgetTag = WidgetTags[i] || {};
        return (
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
    const { title, content, questions, answers, tables } = this.props;
    const widgetTop = this.renderWidgets('top');
    const widgetMiddle = this.renderWidgets('middle');
    const widgetBottom = this.renderWidgets('bottom');
    const imageTop = this.renderImages('top');
    const imageBottom = this.renderImages('bottom');

    return (
      <div className={styles.singleColGrid}>
        <h1 className={`space-bottom section-title ${styles.gridTitle}`}>
          {title}
        </h1>
        {imageTop}
        {widgetTop}
        <div
          className={styles.gridCopy}
          dangerouslySetInnerHTML={renderDef(content)}
        />
        {widgetMiddle}
        {tables && <ObservationsTables answers={answers} tables={tables} />}
        {questions && (
          <div className={styles.gridQas}>
            <QAs {...this.props} />
          </div>
        )}
        {/* </section> */}
        {imageBottom}
        {widgetBottom}
      </div>
    );
  }
}

export default Page;

Page.propTypes = {
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
