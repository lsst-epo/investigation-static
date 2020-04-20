import React from 'react';
import PropTypes from 'prop-types';
import { widgetTags } from './widgets-utilities.js';
import ChartSwitcher from '../../containers/ChartSwitcherContainer.jsx';

class Widget extends React.PureComponent {
  constructor(props) {
    super(props);

    this.widgetTags = { ...widgetTags, ChartSwitcher };
  }

  render() {
    const { type } = this.props;
    const WidgetTag = this.widgetTags[type];

    if (!WidgetTag) return null;

    return <WidgetTag {...this.props} />;
  }
}

Widget.propTypes = {
  type: PropTypes.string,
};

export default Widget;
