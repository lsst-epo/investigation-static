import React from 'react';
import PropTypes from 'prop-types';
import BlocksColumn from './blocks/BlocksColumn.jsx';

import { singleColGrid, gridTitle } from './page.module.scss';

class Page extends React.PureComponent {
  render() {
    const { title, questions, answers, shared, blocksGroups } = this.props;

    const blockShared = {
      questions,
      answers,
      ...shared,
    };

    const defaultLayout = { col: 'left', row: 'top' };

    return (
      <div className={singleColGrid}>
        <h1 className={`space-bottom section-title ${gridTitle}`}>{title}</h1>
        <BlocksColumn
          col="left"
          {...{ blocksGroups, defaultLayout, blockShared }}
        />
      </div>
    );
  }
}

export default Page;

Page.propTypes = {
  blocksGroups: PropTypes.array,
  title: PropTypes.string,
  questions: PropTypes.array,
  answers: PropTypes.object,
  shared: PropTypes.object,
};
