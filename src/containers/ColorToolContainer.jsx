import React from 'react';
import PropTypes from 'prop-types';
import ColorTool from '../components/charts/colorMixingTool/index.jsx';

class ColorToolContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { options, widget } = this.props;
    console.log(options);
    console.log(widget);

    return (
      <>
        <ColorTool isVisible={true} />
      </>
    );
  }
}

ColorToolContainer.propTypes = {
  options: PropTypes.object,
  widget: PropTypes.object,
};

export default ColorToolContainer;
