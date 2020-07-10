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

      console.log(data.filters);

      this.setState(prevState => ({
        ...prevState,
        data: data.filters || [],
      }));
    });
  }

  render() {
    const { options, widget } = this.props;
    const { data } = this.state;
    console.log(options);
    console.log(widget);

    return (
      <>
        <ColorTool data={data} />
      </>
    );
  }
}

ColorToolContainer.propTypes = {
  options: PropTypes.object,
  widget: PropTypes.object,
};

export default ColorToolContainer;
