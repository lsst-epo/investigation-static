import findIndex from 'lodash/findIndex';

export const getFluid = image => {
  const {
    childImageSharp: { fluid },
  } = image;
  return fluid;
};

export const parseName = originalName => {
  return originalName.split('_sci.')[0];
};

export const getNameFromImage = image => {
  const fluid = getFluid(image);
  const { originalName } = fluid;
  return parseName(originalName);
};

export const getActiveIndex = (images, activeId) => {
  return findIndex(images, image => {
    return getNameFromImage(image) === activeId;
  });
};
