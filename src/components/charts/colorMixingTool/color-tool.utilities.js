import flattenDeep from 'lodash/flattenDeep';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';

export const getBrightnessValue = value => {
  return 0.8 * (value / 100) + 0.7;
};

export const getResetBtnState = data => {
  if (isEmpty(data)) return false;

  return data.filters.filter(dataFilter => dataFilter.active).length > 0;
};

export const getDataAndPrepare = (data, name) => {
  if (isArray(data)) {
    return flattenDeep(
      data.map(category => {
        return category.objects
          .filter(datum => datum.name === name)
          .map(datum => {
            return datum.filters.map(newFilter => {
              const { value, defaultValue } = newFilter;
              const sliderValue = defaultValue || value;

              if (newFilter.active && newFilter.image === '') {
                newFilter.image = `${name.toLowerCase()}-${newFilter.label.toLowerCase()}.png`;
              }
              newFilter.brightness = getBrightnessValue(sliderValue);
              return newFilter;
            });
          });
      })
    );
  }
  data.filters.map(newFilter => {
    if (newFilter.active && newFilter.image === '') {
      newFilter.image = `${name.toLowerCase()}-${newFilter.label.toLowerCase()}.png`;
    }
    return newFilter;
  });
  return data;
};

export const setFilterActiveAndLoadImage = (data, name, label, active) => {
  return data.filters.map(curFilter => {
    if (curFilter.label === label) {
      if (curFilter.image === '')
        curFilter.image = `${name.toLowerCase()}-${curFilter.label.toLowerCase()}.png`;
      curFilter.active = !active;
    }
    return curFilter;
  });
};

export const getAnswerData = answer => {
  if (!answer) return null;
  return answer.data;
};

export const getObjectFromArrayGroup = (objects, objectName) => {
  const selectedObject = flattenDeep(
    objects.map(object => object.objects.filter(obj => obj.name === objectName))
  );
  if (isEmpty(selectedObject)) return null;
  return selectedObject[0];
};

export const findObjectFromAnswer = answer => {
  if (!answer) return '';
  if (!answer.data) return '';
  return answer.data;
};

export const getDefaultFilterValues = (data, name) => {
  if (isObject(data)) return data.filters;
  if (isArray(data))
    return data.filter(datum => datum.name === name)[0].filters;
  return {};
};

export const resetAllFilters = data => {
  if (isEmpty(data)) return null;
  if (isEmpty(data.filters)) return null;
  return data.filters.map(filter => {
    const { defaultValue } = filter;
    const sliderValue = defaultValue || 1;

    filter.active = false;
    filter.color = '';
    filter.brightness = getBrightnessValue(sliderValue);
    filter.value = sliderValue;
    return filter;
  });
};
