import findIndex from 'lodash/findIndex';

export const parseName = originalName => {
  return originalName.split('_sci.')[0];
};

export const getNameFromImage = image => image.id;

export const getActiveIndex = (images, activeId) => {
  return findIndex(images, image => {
    return getNameFromImage(image) === activeId;
  });
};
