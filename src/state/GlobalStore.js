import { addCallback, addReducer, setGlobal } from 'reactn';
import ls from 'local-storage';

class GlobalStore {
  constructor() {
    this.emptyState = {
      questions: null,
      answers: {},
      totalNumPages: 20,
      visitedPages: [],
      investigationProgress: 0,
      pageProgress: 0,
      activeId: null,
      activeGraphData: null,
      clusterA: [],
      clusterB: [],
      userDefinedRegions: [],
      // astroDefinedRegions: [],
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
      const global = this.emptyState;

      ls('hrd', global);

      return global;
    });

    addReducer('updatePageId', (global, pageId) => ({
      pageId,
    }));
  }
}

export default GlobalStore;
