/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import BlocksColumn from './blocks/BlocksColumn.jsx';
import Placeholder from '../placeholder';
import {
  leftColGrid,
  gridTitle,
  rightColGrid,
  gridPlaceholder,
} from './page.module.scss';

class TwoCol extends React.PureComponent {
  isPosEmpty(layout = { col: 'right', row: 'bottom' }, targets) {
    return !find(targets, target => {
      const { col, row } = layout;
      const { layout: targetLayout } = target || {};
      const { col: targetCol, row: targetRow } = targetLayout || layout;
      return targetCol === col || targetRow === row;
    });
  }

  render() {
    const {
      title,
      questions,
      answers,
      tables,
      images,
      videos,
      widgets,
      shared,
      blocksGroups,
    } = this.props;

    const blockShared = {
      questions,
      answers,
      ...shared,
    };

    return (
      <div className="container-flex spaced">
        <div className="col padded col-width-50">
          <div className={leftColGrid}>
            <h1 className={`space-bottom section-title ${gridTitle}`}>
              {title}
            </h1>
            <BlocksColumn getCol="left" {...{ blocksGroups, blockShared }} />
          </div>
        </div>
        <div className={`col padded col-width-50 col-fixed ${rightColGrid}`}>
          <BlocksColumn getCol="right" {...{ blocksGroups, blockShared }} />
          {this.isPosEmpty({ col: 'right' }, [
            ...(tables || []),
            ...(images || []),
            ...(videos || []),
            ...(widgets || []),
          ]) && (
            <div className={gridPlaceholder}>
              <Placeholder />
            </div>
          )}
        </div>
      </div>
    );
  }
}

TwoCol.propTypes = {
  blocksGroups: PropTypes.array,
  title: PropTypes.string,
  questions: PropTypes.array,
  answers: PropTypes.object,
  images: PropTypes.array,
  videos: PropTypes.array,
  tables: PropTypes.array,
  widgets: PropTypes.array,
  shared: PropTypes.object,
};

export default TwoCol;
