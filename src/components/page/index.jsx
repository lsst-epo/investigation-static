/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import QAs from '../qas';
import { renderDef } from '../../lib/utilities.js';
import ObservationsTables from '../charts/shared/observationsTables/ObservationsTables';
import styles from './page.module.scss';

class Page extends React.PureComponent {
  render() {
    const {
      title,
      content,
      questions,
      answers,
      tables,
      image,
      WidgetTag,
    } = this.props;

    return (
      <div className={styles.singleColGrid}>
        {/* <section> */}
        <h1 className={`space-bottom section-title ${styles.gridTitle}`}>
          {title}
        </h1>
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
        {WidgetTag && (
          <div className={styles.gridWidget}>
            <WidgetTag {...this.props} />
          </div>
        )}
        {image && (
          <div className={styles.gridImage}>
            <img src={image.mediaPath} alt={image.altText} />
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
  image: PropTypes.object,
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
