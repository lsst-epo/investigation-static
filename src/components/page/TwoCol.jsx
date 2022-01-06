/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import BlocksColumn from './blocks/BlocksColumn.jsx';
import Reference from '../reference';
import { leftColGrid, gridTitle, rightColGrid } from './page.module.scss';

class TwoCol extends React.PureComponent {
  render() {
    const {
      title,
      questions,
      answers,
      shared,
      blocksGroups,
      reference,
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
            <BlocksColumn col="left" {...{ blocksGroups, blockShared }} />
          </div>
        </div>
        <div className={`col padded col-width-50 col-fixed ${rightColGrid}`}>
          {reference && <Reference {...{ reference, blockShared }} />}
          <BlocksColumn col="right" {...{ blocksGroups, blockShared }} />
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
  shared: PropTypes.object,
  reference: PropTypes.object,
};

export default TwoCol;
