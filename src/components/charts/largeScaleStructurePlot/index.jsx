import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-md/lib/Sliders/Slider';
import SelectionControl from 'react-md/lib/SelectionControls/SelectionControl';
import { formatValue } from '../../../lib/utilities.js';
import LargeScaleStructureScatterPlot from './LargeScaleStructureScatterPlot';
import './large-scale-structure-plot.module.scss';

class LargeScaleStructure3DPlot extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showRange: false,
    };
  }

  handleRangeToggle = showRange => {
    this.setState(prevState => ({
      ...prevState,
      showRange,
    }));
  };

  render() {
    const { showRange } = this.state;
    const {
      min,
      max,
      data,
      selectedData,
      sliderVal,
      sliderIncrement,
      sliderCallback,
    } = this.props;
    const selectedRange = sliderVal
      ? `${sliderVal} - ${formatValue(sliderVal + sliderIncrement, 2)}`
      : '';

    return (
      <>
        {data && (
          <LargeScaleStructureScatterPlot
            maximum={max}
            shouldTrim
            dataProp={data}
            altData={selectedData}
          />
        )}
        <SelectionControl
          id="range-selector-toggle"
          type="switch"
          label="Toggle Range Selector"
          name="lights"
          onChange={this.handleRangeToggle}
        />
        {min && max && (
          <>
            <div>
              <div>Selected Range: {selectedRange}</div>
              <Slider
                value={sliderVal}
                min={min}
                max={max - sliderIncrement}
                step={sliderIncrement}
                onChange={sliderCallback}
                disabled={!showRange}
              />
            </div>
          </>
        )}
      </>
    );
  }
}

LargeScaleStructure3DPlot.defaultProps = {
  sliderIncrement: 0.01,
};

LargeScaleStructure3DPlot.propTypes = {
  data: PropTypes.array,
  selectedData: PropTypes.array,
  min: PropTypes.number,
  max: PropTypes.number,
  sliderVal: PropTypes.number,
  sliderIncrement: PropTypes.number,
  sliderCallback: PropTypes.func,
};

export default LargeScaleStructure3DPlot;
