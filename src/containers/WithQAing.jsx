/* eslint-disable react/jsx-props-no-spreading */
import React from 'reactn';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import isObject from 'lodash/isObject';
import filter from 'lodash/filter';
import flattenDeep from 'lodash/flattenDeep';
import { qById, getActiveQ } from '../components/qas/qasUtilities.js';

export const WithQAing = ComposedComponent => {
  class WrappedComponent extends React.PureComponent {
    constructor(props) {
      super(props);

      this.answerAccessorGets = {
        text: this.getTextContent,
        'compound-select': this.getSelectContent,
        'compound-input': this.getCompoundInputContent,
        select: this.getSelectContent,
        'multi-select': this.getMultiSelectContent,
        count: this.getCountContent,
        'light-curve-template': this.getTemplateContent,
        diameter: this.getDiameterCalcContent,
        craterDiameter: this.getCraterDiameterCalcContent,
        magnitude: this.getMagnitudeContent,
        kineticEnergy: this.getKineticEnergyContent,
        volume: this.getVolumeContent,
        mass: this.getMassContent,
        galaxy: this.getGalaxyContent,
        neo: this.getNeoContent,
        galaxies: this.getGalaxiesContent,
        supernova: this.getSupernovaContent,
        hubblePlot: this.getHubblePlotContent,
      };
    }

    componentDidMount() {
      const { answers } = this.global;
      const { data: pageData } = this.props;
      const { questionsByPage: questions } = pageData.allPagesJson.nodes[0];
      const activeQ = getActiveQ(questions, answers);

      if (questions) {
        this.setActiveQuestion(
          activeQ ? activeQ.id : questions[0].question[0].id
        );
      }
    }

    // Methods related to setting & updating "active QA"

    // Callback method passed down to child components
    setActiveQuestion = activeQuestionId => {
      this.dispatch.setActiveQuestionId(activeQuestionId);
    };

    // Callback method passed down to child components
    advanceActiveQuestion = () => {
      const { data: pageData } = this.props;
      const { questionsByPage: questions } = pageData.allPagesJson.nodes[0];

      const { answers } = this.global;
      const activeQ = getActiveQ(questions, answers);

      this.setActiveQuestion(activeQ ? activeQ.id : null);
    };

    // Methods related to updating answers
    getSelectContent(data) {
      return isObject(data) ? 'DEFAULT' : data;
    }

    getCompoundInputContent(data) {
      return data;
    }

    getMultiSelectContent(data) {
      return data.length ? data.join(', ') : 'None Select';
    }

    getTemplateContent(data) {
      return data.type || 'None Selected';
    }

    getMagnitudeContent(data) {
      return data.magnitude || 'None Selected';
    }

    getKineticEnergyContent(data) {
      return data.kineticEnergy || 'None Selected';
    }

    getVolumeContent(data) {
      return data.volume || 'None Selected';
    }

    getMassContent(data) {
      return data.mass || 'None Selected';
    }

    getDiameterCalcContent(data) {
      return data.diameter || 'None Selected';
    }

    getCraterDiameterCalcContent(data) {
      return data.craterDiameter || 'None Selected';
    }

    getCountContent(data) {
      return data.length;
    }

    getTextContent(data) {
      const content = data || '';
      return isObject(content) ? '' : content;
    }

    getRangeContent(data, answerAccessor) {
      return data[0] ? data[0][answerAccessor] : 'None Selected';
    }

    getGalaxyContent(data) {
      const selectedObjects = flattenDeep(
        Object.keys(data).map(galaxyKey => {
          return data[galaxyKey].map(obj => {
            return obj.id;
          });
        })
      );

      const numOfSupernovae = filter(
        selectedObjects,
        item => item === 'supernova'
      ).length;
      const numOfGalaxies = filter(selectedObjects, item => item === 'galaxy')
        .length;

      return `${numOfGalaxies} ${
        numOfGalaxies > 1 ? 'galaxies' : 'galaxy'
      }${numOfSupernovae && ' & '}${numOfSupernovae} ${
        numOfSupernovae > 1 ? 'supernovae' : 'supernova'
      }`;
    }

    getHubblePlotContent(data) {
      const filteredData = filter(data, d => {
        const { distance, velocity } = d;
        return distance && velocity;
      });

      if (!filteredData) {
        return 'No points plotted';
      }

      const numPts = filteredData.length;

      return `${numPts} ${numPts > 1 ? 'points' : 'point'} plotted`;
    }

    getGalaxiesContent(data) {
      const numGalaxies = Object.keys(data).length;
      return `${numGalaxies} ${
        numGalaxies > 1 ? 'galaxies' : 'galaxy'
      } selected`;
    }

    getSupernovaContent(data) {
      const selectedObjects = flattenDeep(
        Object.keys(data).map(galaxyKey => {
          return data[galaxyKey].map(obj => {
            const { id, name } = obj;

            return { [id]: name };
          });
        })
      );

      return selectedObjects[0].supernova;
    }

    getNeoContent(data) {
      return data.name;
    }

    getContent(answerAccessor, data) {
      const contentFunc = this.answerAccessorGets[answerAccessor];

      if (contentFunc) {
        return contentFunc(data) || data;
      }

      if (includes(answerAccessor, 'range')) {
        return this.getRangeContent(data, answerAccessor);
      }

      return data;
    }

    // Callback method passed down to child components
    answerHandler = (id, data, eventType) => {
      if ((id && data) || eventType) {
        const { data: pageData } = this.props;
        const { questionsByPage: questions } = pageData.allPagesJson.nodes[0];
        const { answerAccessor } = qById(questions, id) || {};
        const content = this.getContent(answerAccessor, data);

        this.dispatch.updateAnswer(id, content, data);
      } else {
        this.dispatch.clearAnswer(id);
      }
    };

    updateAnswer = (id, value, type) => {
      if (type !== 'focus') {
        this.answerHandler(id, value, type);
      }

      if (type === 'focus') {
        this.setActiveQuestion(id);
      }

      if (type === 'change' || type === 'blur') {
        this.advanceActiveQuestion();
      }
    };

    render() {
      const { activeQuestionId, answers, activeAnswer } = this.global;

      return (
        <ComposedComponent
          {...this.props}
          {...{ answers, activeAnswer, activeQuestionId }}
          updateAnswer={this.updateAnswer}
          advanceActiveQuestion={this.advanceActiveQuestion}
          setActiveQuestion={this.setActiveQuestion}
        />
      );
    }
  }

  WrappedComponent.propTypes = {
    questions: PropTypes.array,
    data: PropTypes.object,
  };

  return WrappedComponent;
};

export default WithQAing;
