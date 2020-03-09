/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { renderDef } from '../../lib/utilities.js';
import { isPosEmpty } from './blocks/blocksUtilities.js';
import QAs from '../qas';
import Blocks from './blocks/index.jsx';
import Placeholder from '../placeholder';

import {
  leftColGrid,
  gridTitle,
  gridCopy,
  gridQas,
  rightColGrid,
  gridPlaceholder,
} from './page.module.scss';

class TwoCol extends React.PureComponent {
  render() {
    const {
      title,
      content,
      questions,
      answers,
      tables,
      images,
      widgets,
      shared,
    } = this.props;

    const interactiveShared = {
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
            {content && (
              <div
                className={gridCopy}
                dangerouslySetInnerHTML={renderDef(content)}
              />
            )}
            {images && (
              <Blocks blocks={images} type="image" getRow="top" getCol="left" />
            )}
            {widgets && (
              <Blocks
                blocks={widgets}
                type="widget"
                blockShared={interactiveShared}
                getRow="top"
                getCol="left"
              />
            )}
            {tables && (
              <Blocks
                blocks={tables}
                type="table"
                blockShared={answers}
                getRow="top"
                getCol="left"
              />
            )}
            {tables && (
              <Blocks
                blocks={tables}
                type="table"
                blockShared={answers}
                getRow="top"
                getCol="middle"
              />
            )}
            {questions && (
              <div className={gridQas}>
                <QAs {...interactiveShared} />
              </div>
            )}
            {images && (
              <Blocks
                blocks={images}
                type="image"
                getRow="bottom"
                getCol="left"
              />
            )}
            {widgets && (
              <Blocks
                blocks={widgets}
                type="widget"
                blockShared={interactiveShared}
                getRow="bottom"
                getCol="left"
              />
            )}
            {tables && (
              <Blocks
                blocks={tables}
                type="table"
                blockShared={answers}
                getRow="bottom"
                getCol="left"
              />
            )}
          </div>
        </div>
        <div className={`col padded col-width-50 col-fixed ${rightColGrid}`}>
          {images && (
            <Blocks blocks={images} type="image" getRow="top" getCol="right" />
          )}
          {widgets && (
            <Blocks
              blocks={widgets}
              type="widget"
              blockShared={interactiveShared}
              getRow="top"
              getCol="right"
            />
          )}
          {tables && (
            <Blocks
              blocks={tables}
              type="table"
              blockShared={answers}
              getRow="top"
              getCol="right"
            />
          )}
          {images && (
            <Blocks
              blocks={images}
              type="image"
              getRow="bottom"
              getCol="right"
            />
          )}
          {widgets && (
            <Blocks
              blocks={widgets}
              type="widget"
              blockShared={interactiveShared}
              getRow="bottom"
              getCol="right"
            />
          )}
          {tables && (
            <Blocks
              blocks={tables}
              type="table"
              blockShared={answers}
              getRow="bottom"
              getCol="right"
            />
          )}
          {isPosEmpty({ col: 'right' }, [
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
  content: PropTypes.string,
  questions: PropTypes.array,
  answers: PropTypes.object,
  images: PropTypes.array,
  tables: PropTypes.array,
  widgets: PropTypes.array,
  shared: PropTypes.object,
};

export default TwoCol;
