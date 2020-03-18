import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';
// import axios from 'axios';
import API from '../lib/API.js';
import { randomIntFromInterval } from '../lib/utilities.js';
import { getSelectedGalaxies } from '../components/charts/galaxySelector/galaxySelectorUtilities.js';
import GalaxySelector from '../components/charts/galaxySelector/index.jsx';
import GalacticProperties from '../components/charts/galacticProperties/index.jsx';

class GalaxiesSelectorContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      name: null,
      sourcePath: null,
      imagePath: null,
      domain: [],
      activeGalaxy: null,
    };

    this.aId = 'randomGalaxies';
  }

  componentDidMount() {
    const {
      widget: { source, sources },
      options,
      answers,
    } = this.props;
    const { randomSource } = options || {};
    const randomGalaxiesAnswer = answers[this.aId];

    if (source) {
      this.getSetData(source);
    } else if (randomGalaxiesAnswer) {
      const { data: sourcePath } = randomGalaxiesAnswer;

      this.getSetData(sourcePath);
    } else if (sources && randomSource) {
      const randomSourcePath =
        sources[randomIntFromInterval(0, sources.length - 1)];

      this.getSetData(randomSourcePath);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { updateAnswer, options, answers } = this.props;
    const { randomSource } = options || {};

    const { sourcePath } = this.state;
    const newSource = prevState.sourcePath !== sourcePath && !!sourcePath;
    const randomGalaxiesAnswer = answers[this.aId];

    if (newSource && randomSource && !randomGalaxiesAnswer) {
      updateAnswer(this.aId, sourcePath);
    }
  }

  getSetData(source) {
    API.get(source).then(response => {
      const {
        data: { objects, ra, dec },
      } = response;
      const name = this.getName(source);

      this.setState(prevState => ({
        ...prevState,
        data: objects,
        sourcePath: source,
        imagePath: `/images/galaxies/hsc/${name}.jpg`,
        name,
        domain: [ra.reverse(), dec],
      }));
    });
  }

  getName(source) {
    return source
      .split('/')
      .pop()
      .split('.')[0];
  }

  updateActiveGalaxyState(activeGalaxy) {
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
      updateAnswer(qId, allSelected);
    }

    this.updateActiveGalaxyState(selection);
  };

  userGalacticPropertiesCallback = d => {
    this.updateActiveGalaxyState(d ? d[0] : null);
  };

  render() {
    const { answers, options } = this.props;
    const { toggleDataPointsVisibility, showUserPlot, preSelected } =
      options || {};
    const { imagePath, data, name, domain, activeGalaxy } = this.state;

    const selectedData = getSelectedGalaxies(
      answers,
      toggleDataPointsVisibility || showUserPlot
    );

    return (
      <div className="container-flex spaced">
        <div className="col padded col-width-50">
          <h2 className="space-bottom">Galaxies Selector</h2>
          <div className="galaxies-selector-images--container">
            <GalaxySelector
              className="galaxies-selector"
              data={preSelected ? selectedData : data}
              {...{ selectedData, preSelected, activeGalaxy }}
              image={{ mediaPath: imagePath, altText: name }}
              xDomain={domain[0]}
              yDomain={domain[1]}
              selectionCallback={this.selectionCallback}
            />
          </div>
        </div>
        <div className="col padded col-width-50">
          <h2 className="space-bottom">Brightness Vs Distance</h2>
          <GalacticProperties
            className="brightness-vs-distance"
            data={selectedData || []}
            xDomain={[0, 28]}
            yDomain={[0, 200]}
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
