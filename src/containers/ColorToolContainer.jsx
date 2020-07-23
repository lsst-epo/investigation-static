import React from 'react';
import PropTypes from 'prop-types';
import ColorTool from '../components/charts/colorMixingTool/index.jsx';
import API from '../lib/API.js';

class ColorToolContainer extends React.PureComponent {
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
    const { filters, colorOptions, hexColors } = data || {};

    return (
      data && (
        <ColorTool
          useOverlay={false}
          {...{ filters, colorOptions, hexColors }}
        />
      )
    );
  }
}

ColorToolContainer.propTypes = {
  widget: PropTypes.object,
};

export default ColorToolContainer;
