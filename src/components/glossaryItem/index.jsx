import React from 'react';
import PropTypes from 'prop-types';
import styles from './glossary-item.module.scss';

class GlossaryItem extends React.PureComponent {
  renderDef(def) {
    return { __html: def };
  }

  render() {
    const { word, def } = this.props;

    return (
      <div className={styles.glossaryItem}>
        <h2>{word}</h2>
        {/* eslint-disable react/no-danger */}
        <div dangerouslySetInnerHTML={this.renderDef(def)} />
        {/* eslint-enable react/no-danger */}
      </div>
    );
  }
}

export default GlossaryItem;

GlossaryItem.propTypes = {
  word: PropTypes.string,
  def: PropTypes.string,
};
