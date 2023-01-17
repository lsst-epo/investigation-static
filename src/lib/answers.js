import filter from 'lodash/filter';
import flattenDeep from 'lodash/flattenDeep';
import isObject from 'lodash/isObject';

function getGalaxySupernovaContent(data) {
  const galaxyText = data.velocity ? 'astronomy::terms.galaxy' : '';
  const supernovaText = data.distance ? 'astronomy::terms.supernova' : '';
  const foundText =
    data.velocity || data.distance ? 'interface::qas.found_text' : '';
  const andText =
    data.velocity && data.distance ? 'interface::qas.and_text' : '';
  return [galaxyText, andText, supernovaText, foundText];
}

function getHubblePlotContent(data) {
  const filteredData = filter(data, d => {
    const { distance, velocity } = d;
    return distance && velocity;
  });

  return { key: 'widgets::hubble_plot.answer', count: filteredData.length };
}

function getMultiSelectContent(data) {
  return data.length ? data.join(', ') : 'interface::qas.answer_none_selected';
}

function getRangeContent(data, answerAccessor) {
  return data[0]
    ? data[0][answerAccessor]
    : 'interface::qas.answer_none_selected';
}

// Methods related to updating answers
function getSelectContent(data) {
  return isObject(data) ? 'DEFAULT' : data;
}

function getSupernovaContent(data) {
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

function getTextContent(data) {
  const content = data || '';
  return isObject(content) ? '' : content;
}

export const answerAccessorGets = {
  hubblePlot: getHubblePlotContent,
  galaxySupernova: getGalaxySupernovaContent,
  'multi-select': getMultiSelectContent,
  range: getRangeContent,
  select: getSelectContent,
  supernova: getSupernovaContent,
  text: getTextContent,
};

export const xlsxAnswerAccessorGets = {
  ...answerAccessorGets,
};

export function getContent(answerAccessor, data, xlsx = false) {
  const contentFunc = xlsx
    ? xlsxAnswerAccessorGets[answerAccessor]
    : answerAccessorGets[answerAccessor];

  if (contentFunc) {
    return contentFunc(data, answerAccessor) || data;
  }

  return data;
}
