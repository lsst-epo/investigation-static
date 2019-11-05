import { addCallback, addReducer, setGlobal } from 'reactn';
import ls from 'local-storage';

class GlobalStore {
  constructor() {
    this.emptyState = {
      questions: null,
      answers: {},
      pageId: null,
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
    const existingState = ls('hrd') || this.emptyState;

    setGlobal(existingState);
  }

  addCallbacks() {
    addCallback(global => {
      ls('hrd', global);
      return null;
    });
  }

  addReducers() {
    addReducer('empty', () => {
      const emptyGlobal = this.emptyState;

      ls('hrd', emptyGlobal);

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
  }
}

export default GlobalStore;
