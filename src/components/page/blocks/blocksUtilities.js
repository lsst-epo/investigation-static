import find from 'lodash/find';

export const getLayout = function(defaultLayout, layout) {
  const row = layout ? layout.row : null || defaultLayout.row;
  const col = layout ? layout.col : null || defaultLayout.col;
  return { row, col };
};

export const isPosEmpty = function(
  layout = { col: 'right', row: 'bottom' },
  targets
) {
  return !find(targets, target => {
    const { col, row } = layout;
    const { layout: targetLayout } = target || {};
    const { col: targetCol, row: targetRow } = targetLayout || layout;
    return targetCol === col || targetRow === row;
  });
};
