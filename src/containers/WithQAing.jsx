/* eslint-disable react/jsx-props-no-spreading */
import React from 'reactn';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import flattenDeep from 'lodash/flattenDeep';
import { answerAccessorGets } from '../lib/answers';
import { qById, getActiveQ } from '../components/qas/qasUtilities.js';

export const WithQAing = ComposedComponent => {
  class WrappedComponent extends React.PureComponent {
    constructor(props) {
      super(props);

      this.answerAccessorGets = {
        ...answerAccessorGets,
        count: this.getCountContent,
        'light-curve-template': this.getTemplateContent,
        colorTool: this.getColorToolContent,
        diameter: this.getDiameterCalcContent,
        craterDiameter: this.getCraterDiameterCalcContent,
        magnitude: this.getMagnitudeContent,
        kineticEnergy: this.getKineticEnergyContent,
        volume: this.getVolumeContent,
        mass: this.getMassContent,
        galaxy: this.getGalaxyContent,
        coloringGalaxy: this.getColoringGalaxyContent,
        neo: this.getNeoContent,
        galaxies: this.getGalaxiesContent,
        observation: this.getObservationContent,
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

    getCompoundInputContent(data) {
      return data;
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

    getColoringGalaxyContent(data) {
      const selectedObjects = flattenDeep(
        Object.keys(data).map(galaxyKey => {
          return data[galaxyKey].map(obj => {
            return obj.id;
          });
        })
      );

      return `${selectedObjects.length} ${
        selectedObjects.length > 1 ? 'galaxies' : 'galaxy'
      }`;
    }

    getGalaxiesContent(data) {
      const numGalaxies = Object.keys(data).length;
      return `${numGalaxies} ${
        numGalaxies > 1 ? 'galaxies' : 'galaxy'
      } selected`;
    }

    getColorToolContent(data) {
      return `Your selected object: ${data.name}`;
    }

    getNeoContent(data) {
      return data.name;
    }

    getObservationContent(data) {
      return data.label;
    }

    getContent(answerAccessor, data) {
      const contentFunc = this.answerAccessorGets[answerAccessor];

      if (contentFunc) {
        return contentFunc(data, answerAccessor) || data;
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
