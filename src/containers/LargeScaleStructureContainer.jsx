import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import Slider from 'react-md/lib/Sliders/Slider';
import SelectionControl from 'react-md/lib/SelectionControls/SelectionControl';
import API from '../lib/API.js';
import { extentFromSet, formatValue } from '../lib/utilities.js';
// import { arrayifyData } from '../components/charts/largeScaleStructure/largeScaleStructureUtilities.js';
import LargeScaleStructure3D from '../components/charts/largeScaleStructure/LargeScaleStructure3D.jsx';
import LargeScaleStructure2D from '../components/charts/largeScaleStructure/LargeScaleStructure2D.jsx';
import '../components/charts/largeScaleStructure/large-scale-structure-plot.module.scss';

class LargeScaleStructureContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      selectedData: null,
      sliderVal: null,
      min: null,
      max: null,
      rangeSliderEnabled: false,
    };

    this.increment = 0.01;
    this.sliderUnitAdjust = 1 / this.increment;
  }

  componentDidMount() {
    const {
      widget: { source },
    } = this.props;

    API.get(source).then(response => {
      const { data } = response;
      // const { galaxies } = data || {};
      // const [min, max] = extentFromSet(galaxies, 'redshift');
      // const formattedMin = formatValue(min, 2);

      // this.setState(prevState => ({
      //   ...prevState,
      //   data: galaxies,
      //   sliderVal: formattedMin,
      //   min: formattedMin,
      //   max: formatValue(max, 2),
      //   formattedData: arrayifyData(galaxies),
      // }));

      this.setState(prevState => ({
        ...prevState,
        data,
      }));
    });
  }

  handleRangeToggle = rangeSliderEnabled => {
    const { sliderVal, data } = this.state;
    const selectedData = rangeSliderEnabled
      ? this.getSelectedData(data, sliderVal)
      : null;

    this.setState(prevState => ({
      ...prevState,
      rangeSliderEnabled,
      selectedData,
    }));
  };

  getSelectedData = (newData, newValue) => {
    const { data: oldData, sliderVal } = this.state;
    const data = newData || oldData;
    const value = newValue || sliderVal;

    return data.filter(d => {
      const redshift = d[2];
      const greaterThanMin = redshift >= value;
      const lessThanMax = redshift < value + this.increment;

      return greaterThanMin && lessThanMax;
    });
  };

  handleSliderChange = value => {
    this.setState(
      prevState => ({
        ...prevState,
        sliderVal: formatValue(value / 100, 2),
      }),
      debounce(() => {
        const { sliderVal, data } = this.state;
        this.setState(prevState => ({
          ...prevState,
          selectedData: this.getSelectedData(data, sliderVal),
        }));
      }, 400)
    );
  };

  render() {
    const {
      data,
      selectedData,
      max,
      min,
      sliderVal,
      rangeSliderEnabled,
    } = this.state;
    const { options } = this.props;
    const { show2D, show3D } = options || {};
    const selectedRange = sliderVal
      ? `${sliderVal} - ${formatValue(sliderVal + this.increment, 2)}`
      : '';

    return (
      <>
        {min && max && (
          <div>
            <SelectionControl
              id="range-selector-toggle"
              type="switch"
              label="Toggle Redshift Range Selector"
              name="lights"
              onChange={this.handleRangeToggle}
            />
            <div>
              <div>Redshift Range: {selectedRange}</div>
              <Slider
                value={Math.round(
                  formatValue(sliderVal * this.sliderUnitAdjust)
                )}
                min={Math.floor(min * this.sliderUnitAdjust)}
                max={Math.ceil((max - this.increment) * this.sliderUnitAdjust)}
                step={Math.floor(this.increment * this.sliderUnitAdjust)}
                onChange={this.handleSliderChange}
                disabled={!rangeSliderEnabled}
              />
            </div>
          </div>
        )}
        <div className={show2D && show3D ? 'container-flex spaced' : undefined}>
          <div
            className={show2D && show3D ? 'col padded col-width-50' : undefined}
          >
            {show2D && (
              <LargeScaleStructure2D
                {...{
                  data,
                  min,
                  max,
                  sliderVal,
                  selectedData,
                }}
              />
            )}
          </div>
          <div
            className={show2D && show3D ? 'col padded col-width-50' : undefined}
          >
            {show3D && (
              <LargeScaleStructure3D
                {...{
                  data,
                  min,
                  max,
                  sliderVal,
                  selectedData,
                }}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

LargeScaleStructureContainer.propTypes = {
  widget: PropTypes.object,
  options: PropTypes.object,
};

export default LargeScaleStructureContainer;
