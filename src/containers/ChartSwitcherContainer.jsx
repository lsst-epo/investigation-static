import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import BarChart from '../components/site/icons/BarChart';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import { widgetTags } from '../components/widgets/widgets-utilities.js';
import {
  stackedItem,
  visibilityActive,
  paddedDrawerInner,
  navItem,
  activeItem,
} from '../components/charts/shared/navDrawer/nav-drawer.module.scss';
import { nest } from 'd3';

class ChartSwitcherContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
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
      const { xAxisLabel, title } = options || {};
      const label = title || xAxisLabel;

      return {
        leftAvatar: (
          <span>
            <BarChart />
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

  isLoading = value => {
    console.log(value);
    this.setState(prevState => ({
      ...prevState,
      loading: value,
    }));
  };

  render() {
    const { navItems, activeIndex, loading } = this.state;
    const { widget } = this.props;
    const { widgets: nestedWidgets } = widget;
    const activeWidget = nestedWidgets[activeIndex];
    const { options: activeOptions } = activeWidget;
    const { title } = activeOptions || {};

    return (
      <>
        {loading && (
          <CircularProgress
            id="chartSwitcher-loader"
            className="chart-loader"
            scale={3}
          />
        )}
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
                      loadingCallback={this.isLoading}
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
