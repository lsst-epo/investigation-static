import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import API from '../lib/API.js';
import { getSelectedGalaxies } from '../components/charts/galaxySelector/galaxySelectorUtilities.js';
import GalaxySelector from '../components/charts/galaxySelector/index.jsx';
import GalacticProperties from '../components/charts/galacticProperties/index.jsx';

class GalaxiesSelectorContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      imagePath: null,
      domain: [],
    };
  }

  componentDidMount() {
    const {
      widget: { source },
    } = this.props;

    API.get(source).then(response => {
      const {
        data: { objects, ra, dec },
      } = response;
      const name = this.getName(source);

      this.setState(prevState => ({
        ...prevState,
        data: objects,
        imagePath: `/images/galaxies/hsc/${name}.png`,
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

  selectionCallback = d => {
    const {
      answers,
      updateAnswer,
      options: { toggleDataPointsVisibility },
    } = this.props;

    const qId = toggleDataPointsVisibility;
    const answer = answers[qId];
    const answerData = !isEmpty(answer) ? uniq([...d, ...answer.data]) : d;

    if (qId) {
      updateAnswer(qId, answerData);
    }
  };

  userGalacticPropertiesCallback = data => {
    console.log({ data }); // eslint-disable-line no-console
  };

  render() {
    const {
      answers,
      options: { toggleDataPointsVisibility, showUserPlot, preSelected },
    } = this.props;
    const { imagePath, data, name, domain } = this.state;

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
              {...{ selectedData, data, preSelected }}
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
            yDomain={[0, 100]}
            selectionCallback={this.userGalacticPropertiesCallback}
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
