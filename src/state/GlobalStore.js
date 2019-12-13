import { addCallback, addReducer, setGlobal } from 'reactn';
import ls from 'local-storage';

class GlobalStore {
  constructor(investigationId) {
    this.emptyState = {
      investigation: investigationId,
      questions: null,
      answers: {},
      pageId: null,
      activeQuestionId: null,
      totalNumPages: 20,
      visitedPages: [],
      investigationProgress: 0,
      pageProgress: 0,
      activeGraphData: null,
      clusterA: [],
      clusterB: [],
      userDefinedRegions: [],
    };

    // const existingState = this.emptyState;
    const existingState = ls(investigationId) || this.emptyState;

    setGlobal(existingState);
  }

  addCallbacks() {
    addCallback(global => {
      ls(global.investigation, global);
      return null;
    });
  }

  addReducers() {
    addReducer('empty', () => {
      const emptyGlobal = this.emptyState;

      ls(global.investigation, emptyGlobal);

      return emptyGlobal;
    });

    addReducer('updatePageId', (global, dispatch, pageId) => ({
      ...global,
      pageId,
    }));

    addReducer('updateAnswer', (global, dispatch, id, content, data) => {
      const { answers: prevAnswers } = global;
      const prevAnswer = { ...prevAnswers[id] };

      return {
        ...global,
        answers: {
          ...prevAnswers,
          [id]: {
            ...prevAnswer,
            id,
            content,
            data,
          },
        },
      };
    });

    addReducer('clearAnswer', (global, dispatch, id) => {
      const { answers: prevAnswers } = global;

      return {
        ...global,
        answers: {
          ...prevAnswers,
          [id]: {},
        },
      };
    });

    addReducer('setActiveQuestionId', (global, dispatch, id) => {
      const activeAnswer = global.answers[id] || null;

      return {
        ...global,
        activeQuestionId: id,
        activeAnswer,
      };
    });
  }
}

export default GlobalStore;
