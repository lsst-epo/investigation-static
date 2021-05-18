import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';
import classnames from 'classnames';
import API from '../lib/API.js';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import GalacticProperties from '../components/charts/galacticProperties/index.jsx';
import ScatterPlot from '../components/site/icons/Star';
import style from '../components/charts/galacticProperties/galactic-properties.module.scss';
import navStyle from '../components/charts/shared/navDrawer/nav-drawer.module.scss';

class GalacticPropertiesComboContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.properties = [
      {
        name: 'Brightness vs Distance',
        options: {
          svgShapes: ['triangle'],
          title: 'Brightness Vs Distance',
          xAxisLabel: 'Distance (Billion Ly)',
          yAxisLabel: 'Observed Brightness',
          xValueAccessor: 'distance',
          yValueAccessor: 'brightness',
          tooltipAccessors: ['distance', 'brightness'],
          tooltipUnits: ['Billion Ly'],
          tooltipLabels: ['Distance', 'Brightness'],
          xDomain: [0, 28],
          yDomain: [0, 200],
        },
      },
      {
        name: 'Color vs Distance',
        options: {
          svgShapes: ['circle'],
          title: 'Color Vs Distance',
          xAxisLabel: 'Distance (Billion Ly)',
          yAxisLabel: 'Flux ratio i/z (color)',
          xValueAccessor: 'distance',
          yValueAccessor: 'color',
          tooltipAccessors: ['distance', 'color'],
          tooltipUnits: ['Billion Ly', 'Flux ratio'],
          tooltipLabels: ['Distance', 'Color'],
          xDomain: [0, 16],
          yDomain: [0, 2],
        },
      },
    ];

    this.state = {
      data: null,
      activePropertyIndex: 1,
      activeProperty: this.properties[0],
      navItems: this.generateNavItems(this.properties, this.properties[0]),
    };
  }

  componentDidMount() {
    const {
      widget: { source, options },
    } = this.props;
    const { multiple, svgShapes } = options || {};

    this.properties = this.properties.map((property, i) => {
      if (svgShapes && svgShapes[i]) {
        property.options.svgShapes = [svgShapes[i]];
      }
      return property;
    });

    API.get(source).then(response => {
      const { data } = response;
      const responseData = this.getDataObjects(data, multiple);

      this.setState(prevState => ({
        ...prevState,
        data: responseData,
      }));
    });
  }

  getDataObjects = (data, multiple) => {
    if (multiple) {
      return data.map(targetData => {
        if (!targetData.objects) return null;
        return targetData.objects;
      });
    }
    return isArray(data.objects) ? data.objects : [];
  };

  userGalacticPropertiesCallback = () => {
    return null;
  };

  setActiveProperty = (activeProperty, index) => {
    this.setState(prevState => ({
      ...prevState,
      navItems: this.generateNavItems(this.properties, activeProperty),
      activePropertyIndex: index,
      activeProperty,
    }));
  };

  generateNavItems(properties, activeProperty) {
    return properties.map((property, i) => {
      const { name } = property;
      const isActive = activeProperty === property;
      return {
        leftAvatar: (
          <span>
            <ScatterPlot />
            <span className="screen-reader-only">{name}</span>
          </span>
        ),
        primaryText: name,
        className: classnames(navStyle[`colorizedNavItem${i + 1}`], {
          [navStyle.inactive]: !isActive,
          [navStyle.active]: isActive,
        }),
        onClick: () => this.setActiveProperty(property, i + 1),
      };
    });
  }

  render() {
    const { data, navItems, activeProperty, activePropertyIndex } = this.state;
    const {
      title,
      xAxisLabel,
      yAxisLabel,
      xValueAccessor,
      yValueAccessor,
      tooltipAccessors,
      tooltipUnits,
      tooltipLabels,
      xDomain,
      yDomain,
    } = activeProperty.options || {};

    return (
      <NavDrawer
        interactableToolbar
        cardClasses={style.card}
        contentClasses={navStyle.paddedDrawerInner}
        navItems={navItems}
        toolbarTitle={title}
      >
        <div className="container-flex spaced">
          <div className="col padded">
            <GalacticProperties
              className="color-brightness-vs-distance-combo"
              options={activeProperty.options}
              color={`color-${activePropertyIndex}-fill`}
              {...{
                data,
                xAxisLabel,
                yAxisLabel,
                xValueAccessor,
                yValueAccessor,
                tooltipAccessors,
                tooltipUnits,
                tooltipLabels,
                xDomain,
                yDomain,
              }}
              selectionCallback={this.userGalacticPropertiesCallback}
            />
          </div>
        </div>
      </NavDrawer>
    );
  }
}

GalacticPropertiesComboContainer.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  widget: PropTypes.object,
};

export default GalacticPropertiesComboContainer;
