import React from 'react';
import PropTypes from 'prop-types';
import { widgetTags } from './widgets-utilities.js';
import ChartSwitcher from '../../containers/ChartSwitcherContainer.jsx';
import HelpMenu from '../site/helpMenu/index.jsx';

import { helpWrapper } from '../site/helpMenu/help-menu.module.scss';

class Widget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.widgetTags = { ...widgetTags, ChartSwitcher };
  }

  render() {
    const { type } = this.props;
    const WidgetTag = this.widgetTags[type];

    if (!WidgetTag) return null;
    return (
      <div className={helpWrapper}>
        <WidgetTag {...this.props} />
        <HelpMenu />
      </div>
    );
  }
}

Widget.propTypes = {
  type: PropTypes.string,
};

export default Widget;
