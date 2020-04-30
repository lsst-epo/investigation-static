import React from 'react';
import PropTypes from 'prop-types';
import API from '../lib/API.js';
import SizeDistance from '../components/charts/sizeDistance/index.jsx';

class SizeDistanceContainer extends React.PureComponent {
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
        <SizeDistance
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

SizeDistanceContainer.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  widget: PropTypes.object,
  answers: PropTypes.object,
  updateAnswer: PropTypes.func,
};

export default SizeDistanceContainer;
