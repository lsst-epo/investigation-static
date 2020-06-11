/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { renderDef } from '../../lib/utilities.js';
import QAs from '../qas';
import Blocks from './blocks/index.jsx';

import {
  singleColGrid,
  gridTitle,
  gridCopy,
  gridQas,
} from './page.module.scss';

class Page extends React.PureComponent {
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
      <div className={singleColGrid}>
        <h1 className={`space-bottom section-title ${gridTitle}`}>{title}</h1>
        {images && (
          <Blocks
            blocks={images}
            type="image"
            getRow="top"
            getCol="left"
            defaultLayout={{ col: 'left', row: 'top' }}
          />
        )}
        {content && (
          <div
            className={gridCopy}
            dangerouslySetInnerHTML={renderDef(content)}
          />
        )}
        {widgets && (
          <Blocks
            blocks={widgets}
            type="widget"
            blockShared={interactiveShared}
            getRow="top"
            getCol="left"
            defaultLayout={{ col: 'left', row: 'top' }}
          />
        )}
        {tables && (
          <Blocks
            blocks={tables}
            type="table"
            blockShared={answers}
            getRow="top"
            getCol="left"
            defaultLayout={{ col: 'left', row: 'top' }}
          />
        )}
        {images && (
          <Blocks
            blocks={images}
            type="image"
            getRow="middle"
            getCol="left"
            defaultLayout={{ col: 'left', row: 'top' }}
          />
        )}
        {questions && (
          <div className={gridQas}>
            <QAs {...interactiveShared} />
          </div>
        )}
        {tables && (
          <Blocks
            blocks={tables}
            type="table"
            blockShared={answers}
            defaultLayout={{ col: 'left', row: 'top' }}
            getRow="middle"
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
            defaultLayout={{ col: 'left', row: 'top' }}
          />
        )}
        {images && (
          <Blocks
            blocks={images}
            type="image"
            getRow="bottom"
            getCol="left"
            defaultLayout={{ col: 'left', row: 'top' }}
          />
        )}
        {tables && (
          <Blocks
            blocks={tables}
            type="table"
            blockShared={answers}
            getRow="bottom"
            getCol="left"
            defaultLayout={{ col: 'left', row: 'top' }}
          />
        )}
      </div>
    );
  }
}

export default Page;

Page.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  questions: PropTypes.array,
  answers: PropTypes.object,
  images: PropTypes.array,
  tables: PropTypes.array,
  widgets: PropTypes.array,
  shared: PropTypes.object,
};
