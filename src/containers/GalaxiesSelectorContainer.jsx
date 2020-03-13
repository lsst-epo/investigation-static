/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import API from '../lib/API.js';
import { getSelectedGalaxies } from '../components/charts/galaxySelector/galaxySelectorUtilities.js';
import GalaxySelector from '../components/charts/galaxySelector/index.jsx';

class GalaxiesSelectorContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      imagePath: null,
      domain: [],
      activeGalaxies: null,
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
      activeQuestionId,
      options: { toggleDataPointsVisibility },
    } = this.props;

    const qId = toggleDataPointsVisibility || activeQuestionId;
    const answer = answers[qId];
    const answerData = !isEmpty(answer) ? uniq([...d, ...answer.data]) : d;

    if (qId) {
      updateAnswer(qId, answerData);
    }
  };

  render() {
    const {
      answers,
      options: { toggleDataPointsVisibility },
    } = this.props;
    const { imagePath, data, name, domain } = this.state;

    const selectedData = getSelectedGalaxies(
      answers,
      toggleDataPointsVisibility
    );

    return (
      <>
        <h2 className="space-bottom">Galaxies Selector</h2>
        <div className="galaxies-selector-images--container">
          <GalaxySelector
            className="galaxies-selector"
            {...{ selectedData }}
            data={data}
            image={{ mediaPath: imagePath, altText: name }}
            xDomain={domain[0]}
            yDomain={domain[1]}
            selectionCallback={this.selectionCallback}
          />
        </div>
      </>
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
