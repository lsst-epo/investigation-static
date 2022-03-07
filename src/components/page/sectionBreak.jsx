import React from 'react';
import PropTypes from 'prop-types';
import ImageLoader from '../site/imageLoader';
import Block from './blocks/index';

class SectionBreak extends React.PureComponent {
  render() {
    const { title, blocksGroups, shared: blockShared } = this.props;
    const sectionBreakImagePath = '/images/section_break_celebration.gif';

    return (
      <div className="section-break">
        <ImageLoader
          src={sectionBreakImagePath}
          alt="Animated image of fireworks"
          responsive
        />
        <h1>{title}</h1>
        {blocksGroups.map((rowBlockGroup, i) => {
          const { type, blocks } = rowBlockGroup;
          const key = `${type}-${i}`;

          return (
            blocks && <Block key={key} {...{ blocks, type, blockShared }} />
          );
        })}
      </div>
    );
  }
}

export default SectionBreak;

SectionBreak.propTypes = {
  title: PropTypes.string,
  blocksGroups: PropTypes.array,
  shared: PropTypes.object,
};
