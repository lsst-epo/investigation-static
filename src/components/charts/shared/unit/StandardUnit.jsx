import PropTypes from 'prop-types';
import { renderUnit } from './utilities.js';
import Span from './Span';
import TSpan from './TSpan';

const StellarUnit = ({ type, isSvg }) => {
  const WrapperTag = isSvg ? TSpan : Span;

  return <WrapperTag className="unit">&nbsp;{renderUnit(type)}</WrapperTag>;
};

StellarUnit.propTypes = {
  type: PropTypes.string,
  isSvg: PropTypes.bool,
};

export default StellarUnit;
