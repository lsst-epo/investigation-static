import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';
import API from '../lib/API.js';
import GalacticProperties from '../components/charts/galacticProperties/index.jsx';

class GalacticPropertiesContainer extends React.PureComponent {
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

  userGalacticPropertiesCallback = data => {
    console.log({ data });
  };

  render() {
    const { data } = this.state;
    const { options } = this.props;
    const {
      title,
      xAxisLabel,
      yAxisLabel,
      xValueAccessor,
      yValueAccessor,
      tooltipAccessors,
      tooltipUnits,
      tooltipLabels,
    } = options || {};

    return (
      <>
        <h2 className="space-bottom">{title || 'Brightness Vs Distance'}</h2>
        <GalacticProperties
          className="brightness-vs-distance"
          {...{
            data,
            options,
            xAxisLabel,
            yAxisLabel,
            xValueAccessor,
            yValueAccessor,
            tooltipAccessors,
            tooltipUnits,
            tooltipLabels,
          }}
          selectionCallback={this.userGalacticPropertiesCallback}
        />
      </>
    );
  }
}

GalacticPropertiesContainer.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  widget: PropTypes.object,
};

export default GalacticPropertiesContainer;
