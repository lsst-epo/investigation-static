import React from 'react';
import PropTypes from 'prop-types';
import SupernovaSelectorWithLightCurve from '../../../containers/SupernovaSelectorWithLightCurveContainer.jsx';
import GalaxyScrambler from '../../../containers/GalaxyScramblerContainer.jsx';
import GalaxySelector from '../../../containers/GalaxySelectorContainer.jsx';
import GalaxiesSelector from '../../../containers/GalaxiesSelectorContainer.jsx';
import HubblePlot from '../../../containers/HubblePlot2DContainer.jsx';
import HubblePlot3D from '../../../containers/HubblePlot3DContainer.jsx';
import LargeScaleStructurePlot from '../../../containers/LargeScaleStructurePlotContainer.jsx';
import GalacticProperties from '../../../containers/GalacticPropertiesContainer.jsx';
import GalacticPropertiesCombo from '../../../containers/GalacticPropertiesComboContainer.jsx';

import {
  gridWidget,
  gridWidgetTop,
  gridWidgetBottom,
} from '../page.module.scss';

class WidgetBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.widgetTags = {
      SupernovaSelectorWithLightCurve,
      GalaxyScrambler,
      GalaxySelector,
      GalaxiesSelector,
      HubblePlot,
      HubblePlot3D,
      GalacticProperties,
      LargeScaleStructurePlot,
      GalacticPropertiesCombo,
    };

    this.gridClasses = {
      top: gridWidgetTop,
      bottom: gridWidgetBottom,
    };
  }

  render() {
    const { block: widget, row, blockShared: widgetShared } = this.props;
    const { options, type } = widget;
    const WidgetTag = this.widgetTags[type];

    if (!WidgetTag) return null;

    return (
      <div className={`${gridWidget} ${this.gridClasses[row]}`}>
        <WidgetTag
          {...{
            widget,
            options,
            ...widgetShared,
          }}
        />
      </div>
    );
  }
}

WidgetBlock.propTypes = {
  block: PropTypes.object,
  blockShared: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  row: PropTypes.string,
};

export default WidgetBlock;
