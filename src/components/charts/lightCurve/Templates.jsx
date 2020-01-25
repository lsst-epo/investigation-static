/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import Template from './Template.jsx';

class LightCurveTemplates extends React.PureComponent {
  render() {
    const {
      types,
      data,
      activeTemplate,
      zoomCallback,
      peakMagCallback,
      transform,
      interactableTemplates,
      interactablePeakMag,
      peakMagScale,
      activePeakMag,
      peakMagAnswerId,
      templateAnswerId,
    } = this.props;

    const { peakMagX, peakMagY } = activePeakMag || {};

    return (
      <>
        {types.map(type => (
          <Template
            key={type}
            {...{
              type,
              zoomCallback,
              peakMagCallback,
              transform,
              interactableTemplates,
              interactablePeakMag,
              peakMagScale,
              peakMagX,
              peakMagY,
              peakMagAnswerId,
              templateAnswerId,
            }}
            active={activeTemplate === type}
            data={data[type]}
          />
        ))}
      </>
    );
  }
}

LightCurveTemplates.defaultProps = {
  activePeakMag: {},
};

LightCurveTemplates.propTypes = {
  types: PropTypes.array,
  data: PropTypes.object,
  peakMagScale: PropTypes.func,
  activePeakMag: PropTypes.object,
  activeTemplate: PropTypes.string,
  zoomCallback: PropTypes.func,
  peakMagCallback: PropTypes.func,
  transform: PropTypes.object,
  interactableTemplates: PropTypes.bool,
  interactablePeakMag: PropTypes.bool,
  peakMagAnswerId: PropTypes.string,
  templateAnswerId: PropTypes.string,
};

export default LightCurveTemplates;
