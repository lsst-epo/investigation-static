export const getFluxRgba = flux => {
  const blueColorPercent = Math.floor((flux / 2) * 100);
  const redColorPercent = 100 - blueColorPercent;
  return `rgba(${redColorPercent}%, 0%, ${blueColorPercent}%, 0.85)`;
};
