import React from 'react';
import PropTypes from 'prop-types';
import API from '../lib/API.js';
import OrbitalProperties from '../components/charts/orbitalProperties/index.jsx';

class OrbitalPropertiesContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    const { widget } = this.props;
    const { source } = widget || {};

    API.get(source).then(response => {
      const { data } = response;

      this.setState(prevState => ({
        ...prevState,
        data: data.data,
        group: data.group,
      }));
    });
  }

  render() {
    const { data } = this.state;
    const { options } = this.props;
    const {
      xAxisLabel,
      yAxisLabel,
      xValueAccessor: valueAccessor,
      tooltipAccessors,
      tooltipUnits,
      tooltipLabels,
      preSelected,
      domain,
    } = options || {};

    return (
      <>
        <OrbitalProperties
          {...{
            data,
            valueAccessor,
            domain,
            preSelected,
            yAxisLabel,
            xAxisLabel,
            tooltipLabels,
            tooltipAccessors,
            tooltipUnits,
          }}
        />
      </>
    );
  }
}

OrbitalPropertiesContainer.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  widget: PropTypes.object,
  answers: PropTypes.object,
  updateAnswer: PropTypes.func,
};

export default OrbitalPropertiesContainer;
