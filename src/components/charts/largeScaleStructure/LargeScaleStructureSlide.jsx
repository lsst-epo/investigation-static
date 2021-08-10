import React from 'react';
import PropTypes from 'prop-types';
import { slide } from './large-scale-structure-plot.module.scss';

class LargeScaleStructure2D extends React.PureComponent {
  render() {
    const { data } = this.props;
    const { redshiftRange, image } = data;

    return (
      <>
        {image && (
          <img
            className={slide}
            alt={`Largescale Strucutre of redshift from ${redshiftRange}`}
            src={image}
          />
        )}
      </>
    );
  }
}

LargeScaleStructure2D.propTypes = {
  data: PropTypes.object,
};

export default LargeScaleStructure2D;
