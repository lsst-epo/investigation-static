import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';
import classnames from 'classnames';
import API from '../lib/API.js';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import GalacticProperties from '../components/charts/galacticProperties/index.jsx';
import ScatterPlot from '../components/site/icons/Star';
import {
  card,
  linkActive,
  propertyItem,
} from '../components/charts/galacticProperties/galactic-properties.module.scss';
import { paddedDrawerInner } from '../components/charts/shared/navDrawer/nav-drawer.module.scss';

class GalacticPropertiesComboContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.properties = [
      {
        name: 'Brightness vs Distance',
        color: 'rgb(254, 216, 40)',
        options: {
          title: 'Brightness Vs Distance',
          xAxisLabel: 'Distance (Billion Ly)',
          yAxisLabel: 'Total Brightness',
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
        color: 'rgb(26, 181, 121)',
        options: {
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
      activeProperty: this.properties[0],
      navItems: this.generateNavItems(this.properties, this.properties[0]),
    };
  }

  componentDidMount() {
    const {
      widget: { source, options },
    } = this.props;
    const { multiple } = options || {};

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

  setActiveProperty = activeProperty => {
    this.setState(prevState => ({
      ...prevState,
      navItems: this.generateNavItems(this.properties, activeProperty),
      activeProperty,
    }));
  };

  generateNavItems(properties, activeProperty) {
    return properties.map(property => {
      const { name, color } = property;
      return {
        leftAvatar: (
          <span>
            <ScatterPlot style={{ fill: color }} />
            <span className="screen-reader-only">{name}</span>
          </span>
        ),
        primaryText: name,
        className: classnames(propertyItem, {
          [linkActive]: activeProperty === property,
        }),
        onClick: () => this.setActiveProperty(property),
      };
    });
  }

  render() {
    const { data, navItems, activeProperty } = this.state;
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
        cardClasses={card}
        contentClasses={paddedDrawerInner}
        navItems={navItems}
        toolbarTitle={title}
      >
        <div className="container-flex spaced">
          <div className="col padded">
            {/* <h2 className="space-bottom">{title}</h2> */}
            <GalacticProperties
              className="color-brightness-vs-distance-combo"
              options={activeProperty.options}
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
