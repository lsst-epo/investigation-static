import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-md';
import ButtonIcon from '../../site/button/ButtonIcon';
import FullscreenIcon from '../../site/icons/FullscreenIcon';
import FullscreenExit from '../../site/icons/FullscreenExit';
import Widget from '../../widgets/index.jsx';
import { widgetBtn, fullscreen} from '../../site/helpMenu/help-menu.module.scss';

import {
  gridWidget,
  gridWidgetTop,
  gridWidgetBottom,
} from '../page.module.scss';

class WidgetBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFullscreen: false,
    };

    this.gridClasses = {
      top: gridWidgetTop,
      bottom: gridWidgetBottom,
    };
  }

  useFullScreenStyles() {
    return {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'white',
      paddingTop: '75px',
    };
  }

  handleShow = () => {
    this.setState(prevState => ({
      ...prevState,
      isFullscreen: !prevState.isFullscreen,
    }));
  };

  render() {
    const {
      block: widget,
      row,
      blockShared: widgetShared,
      fullscreenButtonClasses,
    } = this.props;
    const { options, type } = widget;
    const { isFullscreen } = this.state;

    if (!type) return null;
    return (
      <div
        style={isFullscreen ? this.useFullScreenStyles() : null}
        className={`${gridWidget} ${this.gridClasses[row]}`}
      >
        <div className={`${widgetBtn} ${fullscreen}`}>
          <Button
            icon
            iconEl={
              <ButtonIcon
                srText="fullscreen"
                Icon={isFullscreen ? FullscreenExit : FullscreenIcon}
              />
            }
            className={fullscreenButtonClasses}
            onClick={this.handleShow}
          />
        </div>
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
  fullscreenButtonClasses: PropTypes.string,
};

export default WidgetBlock;
