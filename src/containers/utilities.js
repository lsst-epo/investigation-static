import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';

export const qWithEmptyA = function(qArray, answers) {
  return find(qArray, q => {
    return isEmpty(answers[q.id]);
  });
};

export const qInArrayById = function(qs, id) {
  const q = find(qs, nestedQ => {
    return nestedQ.id === id;
  });

  return q;
};

export const qById = function(questions, id) {
  const identifiedQ = find(questions, q => {
    return !!qInArrayById(q.question, id);
  });

  if (identifiedQ.question.length > 1) {
    return qInArrayById(identifiedQ.question, id);
  }

  return identifiedQ.question[0];
};

export const getActiveQ = function(questions, answers) {
  if (!questions) return null;

  const firstQ = questions[0].question[0];
  const activeQ = find(questions, question => {
    return !!qWithEmptyA(question.question, answers);
  });

  if (!activeQ) return firstQ;

  if (activeQ.question.length > 1) {
    const nestedActiveQ = qWithEmptyA(activeQ.question, answers);

    return nestedActiveQ || firstQ;
  }

  return activeQ ? activeQ.question[0] : firstQ;
};
