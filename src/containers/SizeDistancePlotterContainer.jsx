import React from 'react';
import PropTypes from 'prop-types';
import API from '../lib/API.js';
import SizeDistancePlotter from '../components/charts/sizeDistancePlotter/index.jsx';
// import { getSelectedGalaxies } from '../components/charts/galaxySelector/galaxySelectorUtilities.js';

class SizeDistancePlotterContainer extends React.PureComponent {
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

    this.getSetData(source);
  }

  getSetData(source) {
    API.get(source).then(response => {
      const { data } = response;

      this.setState(prevState => ({
        ...prevState,
        data,
      }));
    });
  }

  render() {
    const { data } = this.state;
    const { options } = this.props;
    const {
      title,
      preSelected,
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
        <h2 className="space-bottom">{title || ''}</h2>
        <SizeDistancePlotter
          className="size-distance-plotter"
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
            preSelected,
          }}
        />
      </>
    );
  }
}

SizeDistancePlotterContainer.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  widget: PropTypes.object,
  answers: PropTypes.object,
  updateAnswer: PropTypes.func,
};

export default SizeDistancePlotterContainer;
