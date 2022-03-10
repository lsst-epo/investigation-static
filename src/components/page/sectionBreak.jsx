import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'gatsby-plugin-react-i18next';
import ImageLoader from '../site/imageLoader';
import Block from './blocks/index';

class SectionBreak extends React.PureComponent {
  render() {
    const { title, blocksGroups, shared: blockShared, t } = this.props;
    const sectionBreakImagePath = '/images/section_break_celebration.gif';

    return (
      <div className="section-break">
        <ImageLoader
          src={sectionBreakImagePath}
          alt={t('interface::section_break.banner_alt')}
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

export default withTranslation()(SectionBreak);

SectionBreak.propTypes = {
  title: PropTypes.string,
  blocksGroups: PropTypes.array,
  shared: PropTypes.object,
  t: PropTypes.func,
};
