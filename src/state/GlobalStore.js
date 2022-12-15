import { addCallback, addReducer, setGlobal } from 'reactn';
import ls, { remove } from 'local-storage';
import filter from 'lodash/filter';
import uniq from 'lodash/uniq';

class GlobalStore {
  constructor(initialGlobals) {
    this.emptyState = {
      investigation: null,
      name: null,
      answers: {},
      pageId: null,
      activeQuestionId: null,
      activeGraphData: null,
      totalPages: null,
      visitedPages: [],
      totalQAsByInvestigation: null,
      totalQAsByPage: null,
      questionNumbersByPage: null,
      educatorMode: null,
      sections: [],
      savedSources: {},
      fresh: true,
      ...initialGlobals,
    };
    const { investigation } = this.emptyState;

    const hasLocalState = !!ls(investigation);

    const existingState = hasLocalState ? ls(investigation) : this.emptyState;

    setGlobal(existingState);
  }

  addCallbacks() {
    addCallback(global => {
      ls(global.investigation, global);
      return null;
    });
  }

  addReducers() {
    addReducer('empty', global => {
      const { investigation } = global;
      remove(investigation);

      return { ...this.emptyState, fresh: true };
    });

    addReducer('updateName', (global, dispatch, name) => {
      return {
        ...global,
        fresh: false,
        name,
      };
    });

    addReducer('updatePageId', (global, dispatch, pageId) => {
      const {
        pageId: prevPageId,
        totalQAsByPage: prevTotals,
        visitedPages: prevVisitedPages,
      } = global;

      if (!pageId) {
        return {
          ...global,
          pageId,
        };
      }

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
        fresh: false,
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
          fresh: false,
        };
      }
    );

    addReducer('updateAnswerTotals', (global, dispatch, answers) => {
      const { totalQAsByInvestigation: prevTotals } = global;

      return {
        ...global,
        totalQAsByInvestigation: {
          ...prevTotals,
          answers: Object.keys(answers).length,
        },
        fresh: false,
      };
    });

    addReducer('updateAnswer', (global, dispatch, id, content, data) => {
      const { answers: prevAnswers, pageId } = global;
      const prevAnswer = { ...prevAnswers[id] };
      const answers = {
        ...prevAnswers,
        [id]: {
          ...prevAnswer,
          id,
          content,
          data,
        },
      };
      return {
        ...dispatch.updateProgressByPage(pageId, id, true),
        ...dispatch.updateAnswerTotals(answers),
        answers,
        fresh: false,
      };
    });

    addReducer('clearAnswer', (global, dispatch, id) => {
      const { answers: prevAnswers, pageId } = global;
      const answers = {
        ...prevAnswers,
        [id]: {},
      };

      return {
        ...dispatch.updateProgressByPage(pageId, id, false),
        ...dispatch.updateAnswerTotals(answers),
        answers,
        fresh: false,
      };
    });

    addReducer('setActiveQuestionId', (global, dispatch, id) => {
      const activeAnswer = global.answers[id] || null;

      return {
        ...global,
        activeQuestionId: id,
        activeAnswer,
        fresh: false,
      };
    });

    addReducer('setEducatorMode', (global, dispatch, enabled) => {
      return {
        ...global,
        educatorMode: enabled,
        fresh: false,
      };
    });

    addReducer('saveSource', (global, dispatch, id, source) => {
      const { savedSources: prevSavedSources } = global;
      const savedSources = {
        ...prevSavedSources,
        [id]: source,
      };

      return {
        ...global,
        savedSources,
        fresh: false,
      };
    });
  }
}

export default GlobalStore;
