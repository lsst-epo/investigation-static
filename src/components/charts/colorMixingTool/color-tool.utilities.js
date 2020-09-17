import flattenDeep from 'lodash/flattenDeep';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';

export const getBrightnessValue = (filter, value) => {
  const s = filter.max - filter.min;
  return s * (value / 100) + filter.min;
};

export const updateFiltersBrightness = (selectedData, label, value) => {
  return selectedData.filters.map(newFilter => {
    if (newFilter.label === label) {
      newFilter.brightness = getBrightnessValue(newFilter, value);
      newFilter.value = value;
    }
    return newFilter;
  });
};

export const updateFiltersColors = (selectedData, id, value) => {
  return selectedData.filters.map(newFilter => {
    if (`${newFilter.label}-filter` === id) {
      newFilter.color = value;
    }
    return newFilter;
  });
};

export const getResetBtnState = data => {
  if (isEmpty(data)) return false;

  return data.filters.filter(dataFilter => dataFilter.active).length > 0;
};

function updateFilters(datum) {
  const filters = datum.filters.map(newFilter => {
    const { value, defaultValue, label } = newFilter;
    const sliderValue = value || defaultValue;

    if (newFilter.image === '') {
      const imageName = datum.name.toLowerCase().replace(/\s/g, '_');
      const imageLabel = label.toLowerCase();
      newFilter.image = `${imageName}/${imageName}-${imageLabel}.png`;
    }
    newFilter.brightness = getBrightnessValue(newFilter, sliderValue);

    return newFilter;
  });
  return filters;
}

export const getDataAndPrepare = (data, name) => {
  if (isEmpty(data)) return data;

  if (isArray(data)) {
    console.log({ data });
    const preparedData = flattenDeep(
      data.map(category => {
        return category.objects
          .filter(datum => datum.name === name)
          .map(updateFilters);
      })
    );
    console.log({ preparedData });
    return preparedData;
  }

  const preparedData = {
    ...data,
    filters: updateFilters(data),
  };

  return preparedData;
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
  if (!answer) return null;
  if (!answer.data) return null;
  return answer.data;
};

export const getDefaultFilterValues = (data, name) => {
  if (isObject(data)) return data.filters;
  if (isArray(data))
    return data.filter(datum => datum.name === name)[0].filters;
  return {};
};

export const resetAllFilters = data => {
  if (isEmpty(data)) return [];
  if (isEmpty(data.filters)) return [];
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

export const getColorNameFromHex = (hexValue, hexColors, colorOptions) => {
  let foundColor = '';
  hexColors.forEach((hex, index) => {
    if (hex === hexValue) foundColor = colorOptions[index];
    if (hexValue === 'transparent') foundColor = 'none';
  });
  return foundColor ? `fill-color-${foundColor.toLowerCase()}` : '';
};
