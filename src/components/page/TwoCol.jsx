import React from 'react';
import PropTypes from 'prop-types';
import Placeholder from '../placeholder';

class TwoCol extends React.PureComponent {
  renderDef(def) {
    return { __html: def };
  }

  render() {
    const { title, content } = this.props;

    return (
      <div className="container-flex spaced">
        <div className="col padded col-width-50">
          <section>
            <h2 className="section-title">{title}</h2>
            {/* eslint-disable react/no-danger */}
            <div dangerouslySetInnerHTML={this.renderDef(content)} />
            {/* eslint-enable react/no-danger */}
          </section>
        </div>
        <div className="col padded col-width-50 col-fixed">
          <Placeholder />
        </div>
      </div>
    );
  }
}

export default TwoCol;

TwoCol.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};
