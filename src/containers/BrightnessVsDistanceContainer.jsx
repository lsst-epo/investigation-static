import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';
import API from '../lib/API.js';
import BrightnessVsDistance from '../components/charts/brightnessVsDistance/BrightnessVsDistance.jsx';

class BrightnessVsDistanceContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    const {
      widget: { source },
    } = this.props;

    API.get(source).then(response => {
      const { data } = response;
      const { objects: galaxies } = data || {};
      const responseData = isArray(galaxies) ? galaxies : [];

      this.setState(prevState => ({
        ...prevState,
        data: responseData,
      }));
    });
  }

  userBrightnessVsDistanceCallback = data => {
    console.log({ data });
  };

  render() {
    const { data } = this.state;
    const { options } = this.props;

    return (
      <>
        <h2 className="space-bottom">Brightness Vs Distance</h2>
        <BrightnessVsDistance
          className="brightness-vs-distance"
          {...{
            data,
            options,
          }}
          selectionCallback={this.userBrightnessVsDistanceCallback}
        />
      </>
    );
  }
}

BrightnessVsDistanceContainer.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  widget: PropTypes.object,
};

export default BrightnessVsDistanceContainer;
