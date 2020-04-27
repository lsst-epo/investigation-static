import React from 'react';
import PropTypes from 'prop-types';
import API from '../lib/API.js';
import OrbitalViewer from '../components/visualizations/orbitalViewer/index.jsx';

class OrbitalViewerContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    const { widget } = this.props;
    const { source } = widget;

    API.get(source).then(response => {
      const { data } = response;

      this.setState(prevState => ({
        ...prevState,
        data: data.slice(0, 50),
      }));
    });
  }

  render() {
    const { data } = this.state;
    const { options } = this.props;

    return data ? <OrbitalViewer neos={data} options={options} /> : null;
  }
}

OrbitalViewerContainer.propTypes = {
  widget: PropTypes.object,
  options: PropTypes.object,
};

export default OrbitalViewerContainer;
