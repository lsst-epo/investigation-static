import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from '../../../lib/utilities';

function ImagesBlock({ row, col, styles, images }) {
  const defaultLayout = {
    col: 'right',
    row: 'bottom',
  };

  const uRow = row || defaultLayout.row;
  const uCol = col || defaultLayout.col;
  const img =
    images &&
    images.map(image => {
      const { layout } = image;
      const { row: iRow, col: iCol } = layout || defaultLayout;
      return (
        uCol === iCol &&
        uRow === iRow && (
          <div
            className={styles[`gridImage${capitalize(iRow)}`]}
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
