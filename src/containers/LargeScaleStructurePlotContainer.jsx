import React from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import API from '../lib/API.js';
import { extentFromSet, formatValue } from '../lib/utilities.js';
import LargeScaleStructurePlot from '../components/charts/largeScaleStructurePlot/index.jsx';

class LargeScaleStructurePlotContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      selectedData: null,
      sliderVal1: null,
      min: null,
      max: null,
    };

    this.increment = 0.01;
  }

  componentDidMount() {
    const {
      widget: { source },
    } = this.props;

    API.get(source).then(response => {
      const { data } = response;
      const { galaxies } = data || {};
      const [min, max] = extentFromSet(galaxies, 'redshift');
      const formattedData = this.arrayifyData(galaxies);

      this.setState(prevState => ({
        ...prevState,
        data: galaxies,
        min: formatValue(min, 2),
        max: formatValue(max, 2),
        formattedData,
        selectedData: formattedData,
      }));
    });
  }

  arrayifyData(arrObj) {
    if (!arrObj) return null;

    return arrObj.map(obj => {
      const { RA, redshift, Dec } = obj;
      return [RA, redshift, Dec];
    });
  }

  sliderCallback = value => {
    const { formattedData } = this.state;
    const sliderVal = formatValue(value, 2);
    const selectedData = filter(formattedData, d => {
      const redshift = d[1];
      const greaterThanMin = redshift >= sliderVal;
      const lessThanMax = redshift < sliderVal + this.increment;

      return greaterThanMin && lessThanMax;
    });

    this.setState(prevState => ({
      ...prevState,
      selectedData,
      sliderVal,
    }));
  };

  render() {
    const { formattedData, selectedData, max, min, sliderVal } = this.state;

    return (
      <>
        <LargeScaleStructurePlot
          data={formattedData}
          {...{
            min,
            max,
            sliderVal,
            selectedData,
          }}
          sliderIncrement={this.increment}
          sliderCallback={this.sliderCallback}
        />
      </>
    );
  }
}

LargeScaleStructurePlotContainer.propTypes = {
  widget: PropTypes.object,
};

export default LargeScaleStructurePlotContainer;
