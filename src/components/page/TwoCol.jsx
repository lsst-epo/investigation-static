/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import QAs from '../qas';
import BlocksLayout from './blocks/BlocksLayout.jsx';
import Placeholder from '../placeholder';
import {
  leftColGrid,
  gridTitle,
  gridQas,
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
      contents,
      questions,
      answers,
      tables,
      images,
      widgets,
      shared,
    } = this.props;

    const blockShared = {
      questions,
      answers,
      ...shared,
    };

    const blocksGroups = [
      {
        type: 'image',
        blocks: images,
      },
      {
        type: 'content',
        blocks: contents,
      },
      {
        type: 'widget',
        blocks: widgets,
      },
      {
        type: 'table',
        blocks: tables,
      },
    ];

    return (
      <div className="container-flex spaced">
        <div className="col padded col-width-50">
          <div className={leftColGrid}>
            <h1 className={`space-bottom section-title ${gridTitle}`}>
              {title}
            </h1>
            {/* Top Left */}
            <BlocksLayout
              layout={{
                getRow: 'top',
                getCol: 'left',
              }}
              {...{ blocksGroups, blockShared }}
            />
            {/* Middle Left */}
            <BlocksLayout
              layout={{
                getRow: 'middle',
                getCol: 'left',
              }}
              {...{ blocksGroups, blockShared }}
            />
            {questions && (
              <div className={gridQas}>
                <QAs {...blockShared} />
              </div>
            )}
            {/* Bottom Left */}
            <BlocksLayout
              layout={{
                getRow: 'bottom',
                getCol: 'left',
              }}
              {...{ blocksGroups, blockShared }}
            />
          </div>
        </div>
        <div className={`col padded col-width-50 col-fixed ${rightColGrid}`}>
          {/* Top Right */}
          <BlocksLayout
            layout={{
              getRow: 'top',
              getCol: 'right',
            }}
            {...{ blocksGroups, blockShared }}
          />
          {/* Middle Right */}
          <BlocksLayout
            layout={{
              getRow: 'middle',
              getCol: 'right',
            }}
            {...{ blocksGroups, blockShared }}
          />
          {/* Bottom Right */}
          <BlocksLayout
            layout={{
              getRow: 'bottom',
              getCol: 'right',
            }}
            {...{ blocksGroups, blockShared }}
          />
          {this.isPosEmpty({ col: 'right' }, [
            ...(tables || []),
            ...(images || []),
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
  title: PropTypes.string,
  contents: PropTypes.array,
  questions: PropTypes.array,
  answers: PropTypes.object,
  images: PropTypes.array,
  tables: PropTypes.array,
  widgets: PropTypes.array,
  shared: PropTypes.object,
};

export default TwoCol;
