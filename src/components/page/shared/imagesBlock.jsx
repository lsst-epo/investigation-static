import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from '../../../lib/utilities';

function ImagesBlock({ row, col, styles, images }) {
  const uRow = row || 'bottom';
  const uCol = col || 'right';
  const img =
    images &&
    images.map(image => {
      const { layout } = image;
      const { row: iRow, col: iCol } = layout || {};
      const COL = iCol || 'right';
      const ROW = iRow || 'bottom';
      return (
        uCol === COL &&
        uRow === ROW && (
          <div
            className={styles[`gridImage${capitalize(ROW)}`]}
            key={`${image.mediaPath}_${row}-${col}`}
          >
            <img src={image.mediaPath} alt={image.altText} />
          </div>
        )
      );
    });
  return img;
}

ImagesBlock.propTypes = {
  row: PropTypes.string,
  col: PropTypes.string,
  styles: PropTypes.object,
  images: PropTypes.array,
};

export default ImagesBlock;
