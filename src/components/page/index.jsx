import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { renderDef } from '../../lib/utilities.js';

class Page extends React.PureComponent {
  render() {
    const { title, content } = this.props;

    return (
      <>
        <h2>{title}</h2>
        {/* eslint-disable react/no-danger */}
        <div dangerouslySetInnerHTML={renderDef(content)} />
        {/* eslint-enable react/no-danger */}
        <Link to="/">Home</Link>
      </>
    );
  }
}

export default Page;

Page.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};
