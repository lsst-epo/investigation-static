import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../site/card';

class Legend extends React.PureComponent {
  render() {
    const { content, children } = this.props;

    return <Card className="legend">{content || children}</Card>;
  }
}

Legend.propTypes = {
  content: PropTypes.node,
  children: PropTypes.node,
};

export default Legend;
