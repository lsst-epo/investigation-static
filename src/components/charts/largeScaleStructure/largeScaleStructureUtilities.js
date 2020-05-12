export const colorPrimary = '#374785';
export const colorSecondary = '#A8D0E6';

export const arrayifyData = data => {
  if (!data) return null;

  return data.map(obj => {
    const { RA, redshift, Dec } = obj;
    return [RA, Dec, redshift];
  });
};

export const formatTooltipPoint = (color, string) => {
  return (
    "<span style='display:inline-block;width:10px;height:10px;border-radius:50%;background-color:" +
    color +
    ";margin-right:5px;'></span><span>" +
    string +
    '</span>'
  );
};

export const getAxisInfo = axisInfo => {
  return {
    nameTextStyle: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    nameLocation: 'middle',
    nameGap: 35,
    axisLine: {
      onZero: false,
      lineStyle: {
        color: 'white',
        opacity: 1,
      },
    },
    splitLine: {
      show: false,
    },
    ...axisInfo,
  };
};

export const getSeries = (name, options) => {
  return {
    name,
    symbolSize: 8,
    type: 'scatter',
    largeThreshold: 1000,
    progressive: 1000,
    animation: false,
    ...options,
  };
};
