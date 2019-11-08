/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import StellarUnit from './StellarUnit';
import StandardUnit from './StandardUnit';

const Unit = props => {
  return (
    {
      temperature: <StandardUnit {...props} />,
      lifetime: <StandardUnit {...props} />,
      count: <StandardUnit {...props} />,
      luminosity: <StellarUnit {...props} />,
      mass: <StellarUnit {...props} />,
      radius: <StellarUnit {...props} />,
    }[props.type] || null
  );
};

Unit.propTypes = {
  type: PropTypes.string,
  isSvg: PropTypes.bool,
};

export default Unit;
