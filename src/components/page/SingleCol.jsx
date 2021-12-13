import React from 'react';
import PropTypes from 'prop-types';
import BlocksLayout from './blocks/BlocksLayout.jsx';

import { singleColGrid, gridTitle } from './page.module.scss';

class Page extends React.PureComponent {
  render() {
    const {
      title,
      contents,
      questions,
      answers,
      tables,
      images,
      videos,
      widgets,
      checkpoints,
      shared,
    } = this.props;

    const blockShared = {
      questions,
      answers,
      ...shared,
    };

    const defaultLayout = { col: 'left', row: 'top' };
    const blocksGroups = [
      {
        type: 'image',
        blocks: images,
      },
      {
        type: 'video',
        blocks: videos,
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
      {
        type: 'checkpoint',
        blocks: checkpoints,
      },
      {
        type: 'question',
        blocks: questions,
      },
    ];

    return (
      <div className={singleColGrid}>
        <h1 className={`space-bottom section-title ${gridTitle}`}>{title}</h1>
        {/* Top */}
        <BlocksLayout
          layout={{
            getRow: 'top',
            getCol: 'left',
          }}
          {...{ blocksGroups, defaultLayout, blockShared }}
        />
        {/* Middle */}
        <BlocksLayout
          layout={{
            getRow: 'middle',
            getCol: 'left',
          }}
          {...{ blocksGroups, defaultLayout, blockShared }}
        />
        {/* Bottom */}
        <BlocksLayout
          layout={{
            getRow: 'bottom',
            getCol: 'left',
          }}
          {...{ blocksGroups, defaultLayout, blockShared }}
        />
      </div>
    );
  }
}

export default Page;

Page.propTypes = {
  title: PropTypes.string,
  contents: PropTypes.array,
  questions: PropTypes.array,
  answers: PropTypes.object,
  images: PropTypes.array,
  videos: PropTypes.array,
  tables: PropTypes.array,
  widgets: PropTypes.array,
  checkpoints: PropTypes.array,
  shared: PropTypes.object,
};
