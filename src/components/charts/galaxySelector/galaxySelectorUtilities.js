import { isArray } from 'lodash';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';

export const getActiveIndex = (images, activeId) => {
  return findIndex(images, image => {
    return image.id === activeId;
  });
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

export const getAlertFromImageId = (imageId, alerts) => {
  const newAlert = find(alerts, alert => {
    return imageId === alert.alert_id || imageId === alert.image_id;
  });

  return newAlert;
};

export const getAlertImages = (galaxyName, alerts) => {
  return alerts.map(alert => {
    const imageId = alert.image ? +alert.alert_id : alert.image_id;
    const imageFilename = alert.image || `${alert.image_id}_sci.jpg`;

    return {
      id: imageId,
      name: `/images/galaxies/${galaxyName}/${imageFilename}`,
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
    const galaxy = isArray(data)
      ? find(data, { name: activeGalaxy.name })
      : data[activeGalaxy.name];

    if (isEmpty(galaxy)) return null;

    const selectedData = Object.keys(galaxy).map(key => {
      return { ...galaxy[key] };
    });

    return selectedData;
  }

  return null;
};

export const getSelectedGalaxies = (answers, qId) => {
  const answer = answers[qId];

  if (!isEmpty(answer)) {
    const { data } = answer;
    if (isEmpty(data)) return null;

    return data;
  }

  return null;
};
