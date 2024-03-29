import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import API from '../lib/API.js';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import LargeScaleStructureSlide from '../components/charts/largeScaleStructure/LargeScaleStructureSlide.jsx';
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
      activeIndex: null,
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

      this.setState(prevState => ({
        ...prevState,
        loading: false,
        data,
        activeIndex: 0,
        navItems: this.generateNavItems(data, 0),
      }));
    });
  }

  setActiveInterval = activeIndex => {
    const { data } = this.state;

    this.setState(prevState => ({
      ...prevState,
      activeIndex,
      navItems: this.generateNavItems(data, activeIndex),
    }));
  };

  generateNavItems(data, activeIndex) {
    return data.map((datum, i) => {
      const { redshiftRange } = datum;
      return {
        leftAvatar: <span className={navItemText}>{redshiftRange}</span>,
        primaryText: `Redshift Range`,
        className: classnames(navItem, {
          [linkActive]: activeIndex === i,
        }),
        onClick: () => this.setActiveInterval(i),
      };
    });
  }

  render() {
    const { loading, activeIndex, data, navItems } = this.state;
    const toolbarTitle = `Redshift Range: ${
      data ? data[activeIndex].redshiftRange : ''
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
          {data && <LargeScaleStructureSlide data={data[activeIndex]} />}
        </NavDrawer>
      </>
    );
  }
}

LargeScaleStructureContainer.propTypes = {
  widget: PropTypes.object,
};

export default LargeScaleStructureContainer;
