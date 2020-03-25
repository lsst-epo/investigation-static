import find from 'lodash/find';

export const getLayout = function(defaultLayout, layout) {
  if (layout) {
    const row = layout.row || defaultLayout.row;
    const col = layout.col || defaultLayout.col;

    return { row, col };
  }

  return defaultLayout;
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
