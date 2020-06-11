import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import API from '../lib/API.js';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import LargeScaleStructure2D from '../components/charts/largeScaleStructure/LargeScaleStructure2D.jsx';
import {
  navItemText,
  widerDrawerContainer,
  paddedDrawerInnerLeft,
  loadingChartState,
  navItem,
  linkActive,
} from '../components/charts/largeScaleStructure/large-scale-structure-plot.module.scss';

class LargeScaleStructureContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      intervals: null,
      dec: null,
      ra: null,
      activeIntervalIndex: null,
      navItems: [],
      data: null,
    };
  }

  componentDidMount() {
    const {
      widget: { source },
    } = this.props;

    API.get(source).then(response => {
      const { data } = response;
      const { intervals, dec, ra, objects } = data || {};

      this.setState(prevState => ({
        ...prevState,
        loading: false,
        data: objects,
        activeIntervalIndex: 0,
        intervals,
        dec: {
          min: dec[0],
          max: dec[1],
        },
        ra: {
          min: ra[0],
          max: ra[1],
        },
        navItems: this.generateNavItems(intervals, 0),
      }));
    });
  }

  getIntervalVal = (intervals, activeIntervalIndex, index) => {
    if (!intervals) return '';
    return intervals[activeIntervalIndex][index];
  };

  setActiveInterval = activeIntervalIndex => {
    const { intervals } = this.state;

    this.setState(prevState => ({
      ...prevState,
      activeIntervalIndex,
      intervals,
      navItems: this.generateNavItems(intervals, activeIntervalIndex),
    }));
  };

  generateNavItems(intervals, activeIntervalIndex) {
    return intervals.map((interval, i) => {
      return {
        leftAvatar: <span className={navItemText}>{interval.join(' - ')}</span>,
        primaryText: `Redshift Range`,
        className: classnames(navItem, {
          [linkActive]: activeIntervalIndex === i,
        }),
        onClick: () => this.setActiveInterval(i),
      };
    });
  }

  render() {
    const {
      loading,
      intervals,
      activeIntervalIndex,
      data,
      navItems,
      dec,
      ra,
    } = this.state;
    const toolbarTitle = `Redshift Range: ${
      intervals ? intervals[activeIntervalIndex].join(' - ') : ''
    }`;
    const navDrawerClasses = classnames(paddedDrawerInnerLeft, {
      [loadingChartState]: loading,
    });

    return (
      <>
        <NavDrawer
          cardClasses={widerDrawerContainer}
          interactableToolbar
          contentClasses={navDrawerClasses}
          navItems={navItems}
          toolbarTitle={toolbarTitle}
        >
          {loading && (
            <CircularProgress
              id="large-scale-structure-loader"
              className="chart-loader"
              scale={3}
            />
          )}
          {data && (
            <LargeScaleStructure2D
              data={data[activeIntervalIndex]}
              {...{ dec, ra }}
            />
          )}
        </NavDrawer>
      </>
    );
  }
}

LargeScaleStructureContainer.propTypes = {
  widget: PropTypes.object,
  options: PropTypes.object,
};

export default LargeScaleStructureContainer;
