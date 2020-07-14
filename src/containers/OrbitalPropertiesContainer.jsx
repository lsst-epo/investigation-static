import React from 'react';
import PropTypes from 'prop-types';
import { spread, all } from 'axios';
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
    const { source, sources } = widget || {};

    if (sources) {
      all(this.allGets(sources)).then(
        spread((...responses) => {
          const data = responses.map(reponse => {
            const { data: rData } = reponse;
            return rData;
          });

          this.setData(data);
        })
      );
    } else if (source) {
      API.get(source).then(response => {
        const { data } = response;
        this.setData(data);
      });
    }
  }

  setData(data) {
    this.setState(prevState => ({
      ...prevState,
      data: data.data || data,
      group: data.group || 'all',
    }));
  }

  allGets(sources) {
    return sources.map(source => {
      return API.get(source);
    });
  }

  render() {
    const { data } = this.state;
    const { options, widget, nested } = this.props;
    const {
      xAxisLabel,
      yAxisLabel,
      xValueAccessor: valueAccessor,
      tooltipAccessors,
      tooltipUnits,
      tooltipLabels,
      preSelected,
      domain,
      multiple,
      title,
      bins,
    } = options || {};
    const { sources } = widget;

    return (
      <>
        {!nested && title && <h2 className="space-bottom">{title}</h2>}
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
            bins,
          }}
          multiple={multiple || !!sources}
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
  nested: PropTypes.bool,
};

export default OrbitalPropertiesContainer;
