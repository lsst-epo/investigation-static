import { addCallback, addReducer, setGlobal } from 'reactn';
import ls from 'local-storage';
import filter from 'lodash/filter';
import uniq from 'lodash/uniq';

class GlobalStore {
  constructor(initialGlobals) {
    this.emptyState = {
      investigation: null,
      questions: null,
      answers: {},
      pageId: null,
      activeQuestionId: null,
      activeGraphData: null,
      clusterA: [],
      clusterB: [],
      userDefinedRegions: [],
      totalPages: null,
      visitedPages: [],
      totalQAsByInvestigation: null,
      totalQAsByPage: null,
      ...initialGlobals,
    };
    const { investigation } = this.emptyState;

    // const existingState = this.emptyState;
    const existingState = ls(investigation) || this.emptyState;

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
      return this.emptyState;
    });

    addReducer('updatePageId', (global, dispatch, pageId) => {
      const {
        pageId: prevPageId,
        totalQAsByPage: prevTotals,
        visitedPages: prevVisitedPages,
      } = global;

      if (!prevPageId) {
        return {
          ...global,
          pageId,
          visitedPages: [pageId],
        };
      }

      const prevPageTotals = prevTotals[prevPageId] || {};
      const { questions, progress: prevProgress } = prevPageTotals;
      const qLength = questions ? questions.length : 0;
      const progress = qLength === 0 ? 1 : prevProgress;

      return {
        ...global,
        pageId,
        visitedPages: uniq([...prevVisitedPages, pageId]),
        totalQAsByPage: {
          ...prevTotals,
          [prevPageId]: {
            ...prevPageTotals,
            progress,
          },
        },
      };
    });

    addReducer(
      'updateProgressByPage',
      (global, dispatch, pageId, qId, answered) => {
        const { totalQAsByPage: prevTotals } = global;
        const prevPageTotals = prevTotals[pageId];
        const { questions, answers: prevAnswers } = prevTotals[pageId];
        const qLength = questions.length;

        const answers = answered
          ? uniq([...prevAnswers, qId])
          : filter(prevAnswers, qId);
        const progress = qLength === 0 ? 1 : answers.length / qLength;

        return {
          ...global,
          totalQAsByPage: {
            ...prevTotals,
            [pageId]: {
              ...prevPageTotals,
              answers,
              progress,
            },
          },
        };
      }
    );

    addReducer('updateAnswer', (global, dispatch, id, content, data) => {
      const { answers: prevAnswers, pageId } = global;
      const prevAnswer = { ...prevAnswers[id] };

      return {
        ...dispatch.updateProgressByPage(pageId, id, true),
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
      const { answers: prevAnswers, pageId } = global;

      return {
        ...dispatch.updateProgressByPage(pageId, id, false),
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
