import React from 'react';
import PropTypes from 'prop-types';

class HubblePlot3D extends React.PureComponent {
  componentDidMount() {
    const { data, options } = this.props;
    console.log('component did mount', data, options); // eslint-disable-line no-console
  }

  componentDidUpdate() {
    const { data, options } = this.props;
    console.log('component did update', data, options); // eslint-disable-line no-console
  }

  render() {
    return <div>I am a 3D Hubble Plot! Or am I?????????</div>;
  }
}

HubblePlot3D.propTypes = {
  data: PropTypes.array,
  options: PropTypes.object,
};

export default HubblePlot3D;
