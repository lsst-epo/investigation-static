import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';

export const getActiveIndex = (images, activeId) => {
  return findIndex(images, image => {
    return image.id === activeId;
  });
};

export const isSelected = (data, datum) => {
  let selected = false;

  if (!data) return selected;

  data.forEach(item => {
    if (datum.id === item.id) {
      selected = true;
    }
  });

  return selected;
};

export const getActiveImageIndex = (
  activeGalaxy,
  activeAlert,
  activeImageIndex
) => {
  if (activeAlert) {
    return getActiveIndex(activeGalaxy.images, activeAlert.image_id);
  }

  return activeImageIndex;
};

export const getAlertImages = (galaxyName, alerts) => {
  return alerts.map(alert => {
    return {
      id: alert.image_id,
      name: `/images/galaxies/${galaxyName}/${alert.image_id}_sci.jpeg`,
    };
  });
};

export const getSupernovaPointData = activeGalaxy => {
  if (!activeGalaxy) return null;

  const { name, color, supernovaPoint } = activeGalaxy;

  return [{ id: 'supernova', name, color, ...supernovaPoint }];
};

export const getGalaxyPointData = activeGalaxy => {
  if (!activeGalaxy) return null;

  const { name, color, galaxyPoint, supernovaPoint } = activeGalaxy;

  return [
    { id: 'galaxy', name, color, ...galaxyPoint },
    { id: 'supernova', name, color, ...supernovaPoint },
  ];
};

export const getSelectedData = (activeGalaxy, answers, qId) => {
  const answer = answers[qId];

  if (!isEmpty(answer) && activeGalaxy) {
    const { data } = answer;
    const galaxy = data[activeGalaxy.name];
    if (isEmpty(galaxy)) return null;

    const selectedData = Object.keys(galaxy).map(key => {
      return { ...galaxy[key] };
    });

    return selectedData;
  }

  return null;
};
