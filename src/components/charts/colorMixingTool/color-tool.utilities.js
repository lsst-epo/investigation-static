import flattenDeep from 'lodash/flattenDeep';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';

export const getBrightnessValue = (filter, value) => {
  const s = filter.max - filter.min;
  return s * (value / 100) + filter.min;
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
              const { value, defaultValue, label } = newFilter;
              const sliderValue = defaultValue || value;

              if (newFilter.active && newFilter.image === '') {
                const imageName = name.toLowerCase().replace(/\s/g, '_');
                const imageLabel = label.toLowerCase();
                newFilter.image = `${imageName}/${imageName}-${imageLabel}.png`;
              }
              newFilter.brightness = getBrightnessValue(newFilter, sliderValue);
              return newFilter;
            });
          });
      })
    );
  }
  data.filters.map(newFilter => {
    const { value, defaultValue, label } = newFilter;
    const sliderValue = defaultValue || value;
    if (newFilter.active && newFilter.image === '') {
      const imageName = name.toLowerCase();
      const imageLabel = label.toLowerCase();
      newFilter.image = `${imageName}/${imageName}-${imageLabel}.png`;
    }
    newFilter.brightness = getBrightnessValue(newFilter, sliderValue);
    return newFilter;
  });
  return data;
};

export const setFilterActiveAndLoadImage = (data, label, active) => {
  const { name, filters } = data || {};
  return filters.map(curFilter => {
    if (curFilter.label === label) {
      if (curFilter.image === '') {
        const imageName = name.toLowerCase().replace(/\s/g, '_');
        const imageLabel = curFilter.label.toLowerCase();
        curFilter.image = `${imageName}/${imageName}-${imageLabel}.png`;
      }
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
