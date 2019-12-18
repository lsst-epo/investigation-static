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
      activeGraphData: null,
      clusterA: [],
      clusterB: [],
      userDefinedRegions: [],
      investigationProgressState: {},
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

    addReducer(
      'updateProgressByPage',
      (
        global,
        dispatch,
        pageId,
        pageQuestionsData = null,
        answerObj = null
      ) => {
        const {
          // prevIPS = prevInvestigationProgressState
          investigationProgressState: prevIPS,
          answers: prevAnswers,
        } = global;

        const notNullOrEmpty = null || ' ' || '';

        // newIPS = newInvestigationProgressState
        let newIPS = { ...prevIPS };

        const answered = {};
        if (pageQuestionsData !== null) {
          pageQuestionsData.forEach(pqd => {
            pqd.question.forEach(q => {
              answered[q.id] = prevAnswers[q.id]
                ? prevAnswers[q.id].content !== notNullOrEmpty
                : false;
            }, answered);
          });
          newIPS = {
            [pageId]: pageQuestionsData
              .map(qip => {
                const qipObj = qip.question.map(quest => quest.id);
                return {
                  questionCount: qipObj.length,
                  answered,
                };
              })
              .reduce((a, b) => {
                return {
                  questionCount: a.questionCount + b.questionCount,
                  answered,
                };
              }),
          };
        } else {
          newIPS[pageId] = {
            questionCount: 0,
            answered: {},
          };
        }

        if (answerObj !== null) {
          const { questionCount: prevQstnCnt, answered: prevAns } = prevIPS[
            pageId
          ];

          const newAnswered = {
            ...prevAns,
            [answerObj.id]: answerObj.answered !== notNullOrEmpty,
          };

          newIPS = {
            [pageId]: {
              questionCount: prevQstnCnt,
              answered: newAnswered,
            },
          };
        }

        return {
          ...global,
          investigationProgressState: {
            ...prevIPS,
            [pageId]: { ...newIPS[pageId] },
          },
        };
      }
    );

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
