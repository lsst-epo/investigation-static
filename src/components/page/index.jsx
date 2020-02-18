/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import QAs from '../qas';
import { renderDef } from '../../lib/utilities.js';
import ObservationsTables from '../charts/shared/observationsTables/ObservationsTables';
import Images from './shared/images';
import styles from './page.module.scss';

class Page extends React.PureComponent {
  renderImages = () => {
    return <Images {...this.props} classname={styles.gridImage} />;
  };

  render() {
    const {
      title,
      content,
      questions,
      answers,
      tables,
      WidgetTag,
      widget,
    } = this.props;
    const { layout } = widget || {};
    const { row: widgetRow } = layout || {};
    const images = this.renderImages();

    return (
      <div className={styles.singleColGrid}>
        {/* <section> */}
        <h1 className={`space-bottom section-title ${styles.gridTitle}`}>
          {title}
        </h1>
        {widgetRow === 'top' && WidgetTag && (
          <div className={styles[`gridWidget${widgetRow}`]}>
            <WidgetTag {...this.props} />
          </div>
        )}
        <div
          className={styles.gridCopy}
          dangerouslySetInnerHTML={renderDef(content)}
        />
        {tables && <ObservationsTables answers={answers} tables={tables} />}
        {questions && (
          <div className={styles.gridQas}>
            <QAs {...this.props} />
          </div>
        )}
        {/* </section> */}
        {images}
        {(widgetRow === 'bottom' || !widgetRow) && WidgetTag && (
          <div className={styles[`gridWidget${widgetRow}`]}>
            <WidgetTag {...this.props} />
          </div>
        )}
      </div>
    );
  }
}

export default Page;

Page.propTypes = {
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
