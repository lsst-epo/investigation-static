/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import Template from './Template.jsx';

class LightCurveTemplates extends React.PureComponent {
  render() {
    const {
      types,
      activeAnswer,
      data,
      activeTemplate,
      zoomCallback,
      transform,
      isInteractive,
    } = this.props;

    return (
      <>
        {types.map(type => (
          <Template
            key={type}
            {...{ type, zoomCallback, activeAnswer, transform, isInteractive }}
            active={activeTemplate === type}
            data={data[type]}
          />
        ))}
      </>
    );
  }
}

LightCurveTemplates.propTypes = {
  types: PropTypes.array,
  data: PropTypes.object,
  activeAnswer: PropTypes.object,
  activeTemplate: PropTypes.string,
  zoomCallback: PropTypes.func,
  transform: PropTypes.object,
  isInteractive: PropTypes.bool,
};

export default LightCurveTemplates;
