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

  renderWidget = row => {
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
    } = this.props;
    if (!widgets) return null;

    return widgets.map((widget, i) => {
      const { layout, options } = widget || {};
      const { row: widgetRow } = layout || {};
      const ROW = row || 'bottom';
      if (WidgetTags[i] && ROW === (widgetRow || 'bottom')) {
        const WidgetTag = WidgetTags[i];
        const key = `${widgetRow}_${i}`;

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
  };

  render() {
    const { title, content, questions, answers, tables } = this.props;

    return (
      <div className={styles.singleColGrid}>
        <h1 className={`space-bottom section-title ${styles.gridTitle}`}>
          {title}
        </h1>
        <div
          className={styles.gridCopy}
          dangerouslySetInnerHTML={renderDef(content)}
        />
        {this.renderImages('top')}
        {this.renderWidget('top')}
        {tables && <ObservationsTables answers={answers} tables={tables} />}
        {questions && (
          <div className={styles.gridQas}>
            <QAs {...this.props} />
          </div>
        )}
        {this.renderWidget('bottom')}
        {this.renderImages('bottom')}
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
