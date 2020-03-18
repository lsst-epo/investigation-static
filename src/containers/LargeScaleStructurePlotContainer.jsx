import React from 'react';
import PropTypes from 'prop-types';
import API from '../lib/API.js';
import LargeScaleStructurePlot from '../components/charts/largeScaleStructurePlot/index.jsx';

class LargeScaleStructurePlotContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      selectedData: null,
      sliderVal1: null,
      sliderVal2: null,
      min: null,
      max: null,
    };
  }

  componentDidMount() {
    const {
      widget: { source },
    } = this.props;

    API.get(source).then(response => {
      const { data } = response;
      const { galaxies } = data || {};

      this.setState(prevState => ({
        ...prevState,
        data: galaxies,
        min: this.getMin(galaxies),
        max: this.getMax(galaxies),
        formatedData: this.arrayifyData(galaxies),
      }));
    });
  }

  getMax(arrObj) {
    let temp = 0;
    for (let i = 0; i < arrObj.length; i += 1) {
      const obj = arrObj[i];
      if (obj.redshift > temp) {
        temp = obj.redshift;
      }
    }
    return temp;
  }

  getMin(arrObj) {
    let temp = 1000;
    for (let i = 0; i < arrObj.length; i += 1) {
      const obj = arrObj[i];
      if (obj.redshift < temp) {
        temp = obj.redshift;
      }
    }
    return temp;
  }

  arrayifyData(arrObj) {
    if (!arrObj) return null;

    return arrObj.map(obj => {
      const { RA, redshift, Dec } = obj;
      return [RA, redshift, Dec];
    });
  }

  sliderCallback = value => {
    const { data } = this.state;
    const [min, max] = value;

    this.setState(prevState => ({
      ...prevState,
      sliderVal1: parseFloat(min, 10),
      sliderVal2: parseFloat(max, 10),
      selectedData: this.arrayifyData(
        data.filter(obj => {
          return obj.redshift >= min && obj.redshift <= max;
        })
      ),
    }));
  };

  render() {
    const {
      formatedData,
      selectedData,
      max,
      min,
      sliderVal1,
      sliderVal2,
    } = this.state;

    return (
      <>
        <LargeScaleStructurePlot
          className="heat-map-3d-plot"
          data={formatedData}
          {...{ min, max, selectedData, sliderVal1, sliderVal2 }}
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
