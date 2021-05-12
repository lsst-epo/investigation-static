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
        <HelpMenu
          title="Lorem Ipsum"
          content={
            '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Suspendisse at aliquam purus. In lacinia nunc urna. Interdum etmalesuada fames ac ante ipsum primis in faucibus. Morbi vel nibhmagna. Donec ultricies vehicula egestas. Praesent dui ex, lobortisquis lectus quis, pretium porta felis.</p>'
          }
        />
      </div>
    );
  }
}

Widget.propTypes = {
  type: PropTypes.string,
};

export default Widget;
