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
      sliderVal2,
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
        <h3
          style={{
            marginTop: '75px',
            textAlign: 'center',
          }}
        >
          Redshift Range Displayed: {sliderVal1} - {sliderVal2}
        </h3>
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
              start={[min, max]}
              tooltips={[true, true]}
              connect
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
  sliderVal1: PropTypes.number,
  sliderVal2: PropTypes.number,
  sliderCallback: PropTypes.func,
};

export default LargeScaleStructurePlot;
