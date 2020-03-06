import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from '../../../lib/utilities';

class ImagesBlock extends React.PureComponent {
  render() {
    const { col, row, getRow, getCol, styles, images } = this.props;
    return (
      images &&
      images.map(image => {
        if (!image.layout) image.layout = { col, row };
        const { layout } = image;
        const { row: iRow, col: iCol } = layout || {};
        return (
          getCol === iCol &&
          getRow === iRow && (
            <div
              className={styles[`gridImage${capitalize(iRow)}`]}
              key={`${image.mediaPath}_${getRow}-${getCol}`}
            >
              <img src={image.mediaPath} alt={image.altText} />
            </div>
          )
        );
      })
    );
  }
}

ImagesBlock.defaultProps = {
  col: 'right',
  row: 'bottom',
};

ImagesBlock.propTypes = {
  row: PropTypes.string,
  col: PropTypes.string,
  getRow: PropTypes.string,
  getCol: PropTypes.string,
  styles: PropTypes.object,
  images: PropTypes.array,
};

export default ImagesBlock;
