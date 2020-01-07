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
      activeGraphData: null,
      clusterA: [],
      clusterB: [],
      userDefinedRegions: [],
      investigationProgress: {},
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

    addReducer('updatePageId', (global, dispatch, pageId) => {
      const { investigationProgress: prevIPS, pageId: prevPageId } = global;
      const progress = prevIPS[prevPageId];

      if (!progress) {
        return {
          ...global,
          pageId,
        };
      }

      const { questions, answers } = progress;
      if (questions === null && answers === null) {
        return {
          ...global,
          pageId,
          investigationProgress: {
            ...prevIPS,
            [prevPageId]: {
              questions,
              answers,
              progress: 1,
            },
          },
        };
      }

      return {
        ...global,
        pageId,
      };
    });

    addReducer(
      'setInvestigationProgress',
      (global, dispatch, pageId, pageQuestionsData = null) => {
        const {
          investigationProgress: prevIPS,
          answers: globalAnswers,
          pageId: currentPageId,
        } = global;

        if (pageQuestionsData === null) {
          return {
            ...global,
            investigationProgress: {
              ...prevIPS,
              [pageId]: {
                questions: null,
                answers: null,
                progress: currentPageId === pageId ? 1 : 0,
              },
            },
          };
        }

        const questions = [];
        const answers = [];
        pageQuestionsData.forEach(qData => {
          qData.question.forEach(question => {
            const { id: qId } = question;
            questions.push(qId);
            if (globalAnswers[qId]) {
              answers.push(qId);
            }
          });
        });

        return {
          ...global,
          investigationProgress: {
            ...prevIPS,
            [pageId]: {
              questions,
              answers,
              progress: answers.length / questions.length,
            },
          },
        };
      }
    );

    addReducer(
      'updateProgressByPage',
      (global, dispatch, pageId, qId, answered) => {
        const { investigationProgress: prevIPS } = global;
        const { questions, answers: prevAnswers } = prevIPS[pageId];
        const indexOfprevAnswered = prevAnswers.indexOf(qId);
        const prevAnswered = indexOfprevAnswered >= 0;
        const answers = [...prevAnswers];

        if (prevAnswered && !answered) {
          answers.splice(indexOfprevAnswered, 1);
        } else if (!prevAnswered && answered) {
          answers.push(qId);
        }

        return {
          ...global,
          investigationProgress: {
            ...prevIPS,
            [pageId]: {
              questions,
              answers,
              progress: answers.length / questions.length,
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
