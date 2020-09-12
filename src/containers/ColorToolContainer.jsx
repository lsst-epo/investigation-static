import React from 'react';
import PropTypes from 'prop-types';
import ColorTool from '../components/charts/colorMixingTool/index.jsx';
import API from '../lib/API.js';

class ColorToolContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      jsonData: null,
    };
  }

  componentDidMount() {
    const { widget } = this.props;
    const { source } = widget;

    API.get(source).then(response => {
      const { data } = response;
      this.setState(prevState => ({
        ...prevState,
        jsonData: data,
      }));
    });
  }

  render() {
    const { jsonData } = this.state;
    const { title, data, colorOptions, hexColors } = jsonData || {};
    const selectorVal = 'color';
    return (
      jsonData && (
        <ColorTool {...{ title, data, colorOptions, hexColors, selectorVal }} />
      )
    );
  }
}

ColorToolContainer.propTypes = {
  widget: PropTypes.object,
};

export default ColorToolContainer;
