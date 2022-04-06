import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';
// import axios from 'axios';
import API from '../lib/API.js';
import { randomIntFromInterval, getDomains } from '../lib/utilities.js';
import { getSelectedGalaxies } from '../components/charts/galaxySelector/galaxySelectorUtilities.js';
import GalaxySelector from '../components/charts/galaxySelector/index.jsx';
import GalacticProperties from '../components/charts/galacticProperties/index.jsx';

@reactn
class GalaxiesSelectorContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      name: null,
      sourcePath: null,
      imagePath: null,
      imageDomain: [],
      activeGalaxy: null,
      chartDomain: [],
    };

    this.defaultOptions = {
      xValueAccessor: 'distance',
      yValueAccessor: 'brightness',
      xAxisLabel: 'Distance (Billion µLY)',
      yAxisLabel: 'Observed Brightness (Flux Jy',
      tooltipAccessors: ['distance', 'brightness'],
      tooltipUnits: ['Billion Ly'],
      tooltipLabels: ['Distance', 'Brightness'],
    };

    this.aId = 'randomGalaxies';
  }

  componentDidMount() {
    const {
      widget: { source, sources },
      options,
    } = this.props;
    const { savedSources } = this.global;
    const { randomSource } = options || {};
    const randomGalaxiesAnswer = savedSources[this.aId];

    if (source) {
      this.getSetData(source);
    } else if (randomGalaxiesAnswer) {
      this.getSetData(randomGalaxiesAnswer);
    } else if (sources && randomSource) {
      const randomSourcePath =
        sources[randomIntFromInterval(0, sources.length - 1)];
      this.getSetData(randomSourcePath);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { savedSources } = this.global;
    const { options } = this.props;
    const { randomSource } = options || {};

    const { sourcePath } = this.state;
    const newSource = prevState.sourcePath !== sourcePath && !!sourcePath;
    const randomGalaxiesAnswer = savedSources[this.aId];

    if (newSource && randomSource && !randomGalaxiesAnswer) {
      this.dispatch.saveSource(this.aId, sourcePath);
    }
  }

  getSetData(source, callback) {
    const { options } = this.props;
    const { xValueAccessor, yValueAccessor } = {
      ...this.defaultOptions,
      ...(options || {}),
    };

    API.get(source).then(response => {
      const {
        data: { objects, ra, dec },
      } = response;
      const name = this.getName(source);
      const domains = getDomains(objects, xValueAccessor, yValueAccessor);

      this.setState(
        prevState => ({
          ...prevState,
          data: objects,
          sourcePath: source,
          imagePath: `/images/galaxies/hsc/${name}.jpg`,
          name,
          imageDomain: [ra.reverse(), dec],
          chartDomain: [
            [0, domains[0][1]],
            [0, domains[1][1]],
          ],
        }),
        callback
      );
    });
  }

  getName(source) {
    return source
      .split('/')
      .pop()
      .split('.')[0];
  }

  updateActiveGalaxy(activeGalaxy) {
    const { activeGalaxy: prevActiveGalaxy } = this.state;

    if (prevActiveGalaxy !== activeGalaxy) {
      this.setState(prevState => ({
        ...prevState,
        activeGalaxy,
      }));
    }
  }

  selectionCallback = (allSelected, selection) => {
    const { updateAnswer, options } = this.props;
    const { toggleDataPointsVisibility: qId } = options || {};

    if (qId && isArray(allSelected)) {
      updateAnswer(qId, allSelected, 'change');
    }

    this.updateActiveGalaxy(selection);
  };

  userGalacticPropertiesCallback = d => {
    this.updateActiveGalaxy(d ? d[0] : null);
  };

  render() {
    const { answers, options } = this.props;
    const { color } = options;
    const { toggleDataPointsVisibility, showUserPlot, preSelected } =
      options || {};
    const {
      imagePath,
      data,
      name,
      imageDomain,
      chartDomain,
      activeGalaxy,
    } = this.state;

    const selectedData = getSelectedGalaxies(
      answers,
      toggleDataPointsVisibility || showUserPlot
    );

    if (!toggleDataPointsVisibility && !showUserPlot) {
      return (
        <div className="galaxies-selector-container">
          <div className="galaxies-selector-images-container">
            <GalaxySelector
              className="galaxies-selector"
              data={preSelected ? selectedData : data}
              color={color}
              {...{ selectedData, preSelected, activeGalaxy }}
              image={{ mediaPath: imagePath, altText: name }}
              xDomain={imageDomain[0]}
              yDomain={imageDomain[1]}
              selectionCallback={this.selectionCallback}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="container-flex spaced galaxies-selector-container">
        <div className="col padded col-width-50">
          <h2 className="space-bottom">Galaxies Selector</h2>
          <div className="galaxies-selector-images-container">
            <GalaxySelector
              className="galaxies-selector"
              data={preSelected ? selectedData : data}
              color={color}
              {...{ selectedData, preSelected, activeGalaxy }}
              image={{ mediaPath: imagePath, altText: name }}
              xDomain={imageDomain[0]}
              yDomain={imageDomain[1]}
              selectionCallback={this.selectionCallback}
            />
          </div>
        </div>
        <div className="col padded col-width-50">
          <h2 className="space-bottom">Brightness vs. Distance</h2>
          <GalacticProperties
            className="brightness-vs-distance"
            data={selectedData || []}
            options={options}
            xDomain={chartDomain[0]}
            yDomain={chartDomain[1]}
            selectionCallback={this.userGalacticPropertiesCallback}
            {...{ activeGalaxy, name }}
          />
        </div>
      </div>
    );
  }
}

GalaxiesSelectorContainer.propTypes = {
  widget: PropTypes.object,
  options: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  updateAnswer: PropTypes.func,
};

export default GalaxiesSelectorContainer;
