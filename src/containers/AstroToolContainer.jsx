import React from 'react';
import PropTypes from 'prop-types';
import ColorTool from '../components/charts/colorMixingTool/index.jsx';
import API from '../lib/API.js';

class AstroToolContainer extends React.PureComponent {
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
        data,
      }));
    });
  }

  render() {
    const { data } = this.state;
    const { filters, colorOptions, hexColors, galaxies } = data || {};

    return (
      data && <ColorTool {...{ filters, colorOptions, hexColors, galaxies }} />
    );
  }
}

AstroToolContainer.propTypes = {
  widget: PropTypes.object,
};

export default AstroToolContainer;
