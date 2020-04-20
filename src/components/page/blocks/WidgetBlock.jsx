import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../../widgets/index.jsx';

import {
  gridWidget,
  gridWidgetTop,
  gridWidgetBottom,
} from '../page.module.scss';

class WidgetBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.gridClasses = {
      top: gridWidgetTop,
      bottom: gridWidgetBottom,
    };
  }

  render() {
    const { block: widget, row, blockShared: widgetShared } = this.props;
    const { options, type } = widget;

    if (!type) return null;
    return (
      <div className={`${gridWidget} ${this.gridClasses[row]}`}>
        <Widget
          {...{
            widget,
            options,
            ...widgetShared,
          }}
          type={type}
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
