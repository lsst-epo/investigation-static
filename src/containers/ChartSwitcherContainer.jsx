import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../components/site/icons/CustomIcon';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import { widgetTags } from '../components/widgets/widgets-utilities.js';
import {
  stackedItem,
  visibilityActive,
  paddedDrawerInner,
  navItem,
  activeItem,
} from '../components/charts/shared/navDrawer/nav-drawer.module.scss';

class ChartSwitcherContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      navItems: null,
      activeIndex: 0,
    };
  }

  componentDidMount() {
    const { activeIndex } = this.state;

    this.setState(prevState => ({
      ...prevState,
      navItems: this.generateNavItems(activeIndex),
    }));
  }

  setActiveIndex(index) {
    this.setState(prevState => ({
      ...prevState,
      activeIndex: index,
      navItems: this.generateNavItems(index),
    }));
  }

  generateNavItems(activeIndex) {
    const { widget } = this.props;
    const { widgets: nestedWidgets } = widget;

    return nestedWidgets.map((nestedWidget, i) => {
      const { options } = nestedWidget;
      const { xAxisLabel, title, icon } = options || {};
      const label = title || xAxisLabel;
      // console.log('nested', xAxisLabel, title);
      return {
        leftAvatar: (
          <span>
            <Icon name={icon || 'barChart'} />
            <span className="screen-reader-only">{label}</span>
          </span>
        ),
        primaryText: label,
        className: classnames(navItem, {
          [activeItem]: activeIndex === i,
        }),
        onClick: () => this.setActiveIndex(i),
      };
    });
  }

  render() {
    const { navItems, activeIndex } = this.state;
    const { widget } = this.props;
    const { widgets: nestedWidgets } = widget;
    const activeWidget = nestedWidgets[activeIndex];
    const { options: activeOptions } = activeWidget;
    const { title } = activeOptions || {};

    return (
      <>
        {navItems && (
          <NavDrawer
            interactableToolbar
            navItems={navItems}
            toolbarTitle={title}
          >
            <div className={paddedDrawerInner}>
              {nestedWidgets.map((nestedWidget, i) => {
                const { type, options: nestedOptions } = nestedWidget;
                const key = type + i;
                const WidgetTag = widgetTags[type];

                if (!WidgetTag) return null;

                const itemClasses = classnames(stackedItem, {
                  [visibilityActive]: activeIndex === i,
                });

                return (
                  <div key={key} className={itemClasses}>
                    <WidgetTag
                      type={type}
                      widget={nestedWidget}
                      options={nestedOptions}
                      nested
                    />
                  </div>
                );
              })}
            </div>
          </NavDrawer>
        )}
      </>
    );
  }
}

ChartSwitcherContainer.propTypes = {
  // options: PropTypes.object,
  widget: PropTypes.object,
};

export default ChartSwitcherContainer;
