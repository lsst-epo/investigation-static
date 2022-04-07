import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import isArray from 'lodash/isArray';
import API from '../lib/API.js';
import { randomIntFromInterval } from '../lib/utilities.js';
import GalacticProperties from '../components/charts/galacticProperties/index.jsx';
// import { getSelectedGalaxies } from '../components/charts/galaxySelector/galaxySelectorUtilities.js';

@reactn
class GalacticPropertiesContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    const {
      widget: { source, sources },
      options,
      answers,
    } = this.props;
    const { savedSources } = this.global;
    const { randomSource, showUserPlot, multiple } = options || {};
    const randoGalsAnsId = 'randomGalaxies';
    const randomGalaxiesAnswer = (savedSources || {})[randoGalsAnsId];
    const userPlotAnswer = (answers || {})[showUserPlot];
    const userPlot = userPlotAnswer ? userPlotAnswer.data : [];

    if (sources && showUserPlot && multiple) {
      axios.all(this.allGets(sources)).then(
        axios.spread((...responses) => {
          const data = responses
            .map(reponse => {
              const { data: rData } = reponse;
              const { objects } = rData;
              return objects || [];
            })
            .flat();

          this.setState(prevState => ({
            ...prevState,
            data: [data, userPlot],
          }));
        })
      );
    } else if (source && showUserPlot && multiple) {
      API.get(source).then(response => {
        const { data } = response;
        const { objects } = data || {};

        this.setState(prevState => ({
          ...prevState,
          data: [objects || [], userPlot],
        }));
      });
    } else if (showUserPlot) {
      this.setState(prevState => ({
        ...prevState,
        data: userPlot,
      }));
    } else if (source) {
      this.getSetData(source);
    } else if (randomGalaxiesAnswer) {
      this.getSetData(randomGalaxiesAnswer);
    } else if (sources && randomSource) {
      const randomSourcePath =
        sources[randomIntFromInterval(0, sources.length - 1)];

      this.getSetData(randomSourcePath);
      this.dispatch.saveSource(randoGalsAnsId, randomSourcePath);
    }
  }

  allGets(sources) {
    return sources.map(source => {
      return API.get(source);
    });
  }

  getSetData(source, options) {
    const { multiple } = options || {};

    API.get(source).then(response => {
      const { data } = response;
      const responseData = this.getDataObjects(data, multiple);

      this.setState(prevState => ({
        ...prevState,
        data: responseData,
      }));
    });
  }

  getDataObjects = (data, multiple) => {
    if (multiple) {
      return data.map(targetData => {
        if (!targetData.objects) return null;
        return targetData.objects;
      });
    }

    return isArray(data.objects) ? data.objects : [];
  };

  render() {
    const { data } = this.state;
    const { options, nested } = this.props;
    const {
      title,
      xAxisLabel,
      yAxisLabel,
      xValueAccessor,
      yValueAccessor,
      tooltipAccessors,
      tooltipUnits,
      tooltipLabels,
      preSelected,
    } = options || {};

    return (
      <div className="galactic-properties-container">
        {!nested && (
          <h2 className="space-bottom">{title || 'Brightness vs. Distance'}</h2>
        )}
        <GalacticProperties
          className="brightness-vs-distance"
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
      </div>
    );
  }
}

GalacticPropertiesContainer.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  widget: PropTypes.object,
  answers: PropTypes.object,
  nested: PropTypes.bool,
};

export default GalacticPropertiesContainer;
