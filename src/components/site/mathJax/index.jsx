import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tex2SVG, { MathJaxProvider } from 'react-hook-mathjax';
import { mathJaxContainer } from './mathJax.module.scss';

export default function MathJaxComponent({ displayType, latex }) {
  // const mathJaxOptions = {
  //   loader: { load: ['[tex]/color'] },
  //   tex: { packages: { '[+]': ['color'] } },
  // };

  return (
    <div
      className={classnames({ [mathJaxContainer]: displayType !== 'inline' })}
    >
      <Tex2SVG display={displayType} latex={latex} />
    </div>
  );
}

MathJaxComponent.defaultProps = {
  displayType: 'block',
};

MathJaxComponent.propTypes = {
  displayType: PropTypes.string,
  latex: PropTypes.string,
};
