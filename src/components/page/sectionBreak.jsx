import React from 'reactn';
import PropTypes from 'prop-types';
import { withTranslation } from 'gatsby-plugin-react-i18next';
import ImageLoader from '../site/imageLoader';
import Block from './blocks/index';

class SectionBreak extends React.PureComponent {
  render() {
    const { blocksGroups, shared: blockShared, t } = this.props;
    const { section } = blockShared;
    const { sections } = this.global;
    const isFinalBreak = section === sections.length - 2;
    const sectionBreakImgRoot = '/images/section_break/';
    const sectionBreakFileName = isFinalBreak
      ? t('interface::section_break.final_image')
      : 'section_break_celebration.gif';
    const sectionBreakImagePath = `${sectionBreakImgRoot}${sectionBreakFileName}`;

    return (
      <div className="section-break">
        <ImageLoader
          src={sectionBreakImagePath}
          alt={t('interface::section_break.banner_alt')}
          responsive
        />
        <h1>{t('interface::section_break.title')}</h1>
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
