import React from 'react';
import PropTypes from 'prop-types';
import Nouislider from 'nouislider-react';
import debounce from 'lodash/debounce';
import LargeScaleStructureScatterPlot from './LargeScaleStructureScatterPlot';
import 'nouislider/distribute/nouislider.css';
import './large-scale-structure-plot.module.scss';

class LargeScaleStructurePlot extends React.PureComponent {
  render() {
    const {
      min,
      max,
      toggleMinVal,
      sliderVal1,
      data,
      selectedData,
      sliderCallback,
    } = this.props;
    const debouncedSliderCallback = debounce(sliderCallback, 15);

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
        <div
          style={{
            marginTop: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {min && max && (
            <Nouislider
              onUpdate={debouncedSliderCallback}
              range={{ min, max }}
              start={toggleMinVal}
              tooltips
              connect="lower"
            />
          )}
        </div>
      </>
    );
  }
}

LargeScaleStructurePlot.propTypes = {
  data: PropTypes.array,
  selectedData: PropTypes.array,
  min: PropTypes.number,
  max: PropTypes.number,
  toggleMinVal: PropTypes.number,
  sliderVal1: PropTypes.number,
  sliderCallback: PropTypes.func,
};

export default LargeScaleStructurePlot;
