import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tex2SVG, { MathJaxProvider } from 'react-hook-mathjax';
import { mathJaxContainer } from './mathJax.module.scss';

export default function MathJaxComponent({ displayType, laTex }) {
  const mathJaxOptions = {
    skipHtmlTags: { '[+]': ['span'] },
    ignoreHtmlClass: 'mathjax_ignore',
  };
  return (
    <div
      className={classnames({ [mathJaxContainer]: displayType !== 'inline' })}
    >
      <MathJaxProvider options={mathJaxOptions} />
      <Tex2SVG display={displayType} latex={laTex} />
    </div>
  );
}

MathJaxComponent.defaultProps = {
  displayType: 'block',
};

MathJaxComponent.propTypes = {
  displayType: PropTypes.string,
  laTex: PropTypes.string,
};
