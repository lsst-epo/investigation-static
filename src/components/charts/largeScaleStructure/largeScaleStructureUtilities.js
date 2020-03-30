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

export const getAxisInfo = title => {
  return {
    nameTextStyle: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    name: title,
    nameLocation: 'middle',
    nameGap: 25,
    axisLine: {
      lineStyle: {
        color: 'black',
        opacity: 1,
      },
    },
  };
};

export const getSeries = (name, options) => {
  return {
    name,
    symbolSize: 8,
    type: 'scatter',
    encode: {
      x: 'RA',
      y: 'Dec',
    },
    largeThreshold: 1000,
    ...options,
  };
};
