import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import classnames from 'classnames';
import API from '../lib/API.js';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import ConditionalWrapper from '../components/ConditionalWrapper';
import AsteroidClass from '../components/charts/asteroidClass/index.jsx';

import {
  drawerContainer,
  paddedDrawerInner,
  navItem,
  avatarContainer,
  navAvatar,
  linkActive,
} from '../components/charts/asteroidClass/asteroid-class.module.scss';

class AsteroidClassContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      overlayData: null,
      data: null,
      groups: null,
      twoUp: false,
      activeOverlay: null,
      activeGroupIndex: 0,
    };
  }

  componentDidMount() {
    const {
      widget: { source, sources },
      options,
    } = this.props;
    const { multiple } = options || {};

    if (sources && !source) {
      axios.all(this.allGets(sources)).then(
        axios.spread((...responses) => {
          const data = responses.map(reponse => {
            const { data: rData } = reponse;
            return rData;
          });

          this.setState(prevState => ({
            ...prevState,
            data: data.map(d => d.data),
            groups: data.map(d => d.group),
            twoUp: true,
          }));
        })
      );
    } else if (source && !sources) {
      API.get(source).then(response => {
        const { data } = response;
        const { data: neos, group } = data;
        this.setState(prevState => ({
          ...prevState,
          data: neos,
          groups: [group],
          twoUp: false,
        }));
      });
    } else if (source && sources && multiple) {
      axios.all(this.allGets([...sources, source])).then(
        axios.spread((...responses) => {
          const data = responses.map(reponse => {
            const { data: rData } = reponse;
            return rData;
          });
          const overlayData = data.pop();

          this.setState(prevState => ({
            ...prevState,
            overlayData,
            activeOverlay: multiple ? overlayData[0].filters : null,
            data: data.map(d => d.data),
            group: data.map(d => d.group),
            twoUp: true,
          }));
        })
      );
    } else if (sources && source && !multiple) {
      axios.all(this.allGets([...sources, source])).then(
        axios.spread((...responses) => {
          const data = responses.map(reponse => {
            const { data: rData } = reponse;
            return rData;
          });
          const overlayData = data.pop();
          const groups = data.map(d => d.group);

          this.setState(prevState => ({
            ...prevState,
            overlayData,
            activeOverlay: overlayData ? overlayData[0].filters : null,
            activeGroup: groups[0],
            data: data.map(d => d.data),
            groups,
            twoUp: false,
          }));
        })
      );
    }
  }

  allGets(sources) {
    return sources.map(source => {
      return API.get(source);
    });
  }

  updateActiveOverlay(activeOverlay) {
    this.setState(prevState => ({
      ...prevState,
      activeOverlay,
    }));
  }

  updateActiveGroupIndex(activeGroupIndex) {
    this.setState(prevState => ({
      ...prevState,
      activeGroupIndex,
    }));
  }

  generateNavItems(navItems) {
    if (!navItems) return [];
    const { activeGroupIndex, groups } = this.state;
    const activeGroup = groups[activeGroupIndex];

    return navItems.map((item, i) => {
      return {
        leftAvatar: (
          <div className={avatarContainer}>
            <div className={navAvatar}>{`${item} Class`}</div>
          </div>
        ),
        primaryText: ' ',
        className: classnames(navItem, {
          [linkActive]: activeGroup === item,
        }),
        onClick: () => this.updateActiveGroupIndex(i),
      };
    });
  }

  generateNavItemsMulti(navItems) {
    const { activeOverlay } = this.state;

    return navItems.map((item, i) => {
      return {
        leftAvatar: (
          <div className={avatarContainer}>
            <div className={navAvatar}>{`#${i + 1}`}</div>
          </div>
        ),
        primaryText: ' ',
        className: classnames(navItem, {
          [linkActive]: activeOverlay === item.filters,
        }),
        onClick: () => this.updateActiveOverlay(item.filters),
      };
    });
  }

  render() {
    const {
      data,
      overlayData,
      activeOverlay,
      activeGroupIndex,
      groups,
      twoUp,
    } = this.state;
    const { options, widget } = this.props;
    const { sources } = widget || {};
    const {
      yAxisLabel,
      tooltipAccessors,
      tooltipUnits,
      tooltipLabels,
      preSelected,
      multiple,
    } = options || {};
    const activeGroup = groups ? groups[activeGroupIndex] : null;
    const activeData = data ? data[activeGroupIndex] : null;

    return (
      <ConditionalWrapper
        condition={multiple && !!overlayData}
        wrapper={children => (
          <NavDrawer
            cardClasses={drawerContainer}
            navItems={this.generateNavItemsMulti(overlayData)}
            contentClasses={paddedDrawerInner}
            toolbarStyles={{ display: 'none' }}
          >
            {children}
          </NavDrawer>
        )}
      >
        {twoUp ? (
          <div className="container-flex">
            {data.map((d, i) => {
              const group = groups[i] ? groups[i].toUpperCase() : null;

              return (
                <div key={`${group}`} className="col-width-50">
                  <h2 className="space-bottom">
                    {group ? `${group} Type Classification` : 'Asteroid Class'}
                  </h2>
                  <AsteroidClass
                    className="brightness-vs-distance"
                    xAxisLabel={group ? `${group} Class` : 'Asteroid Class'}
                    data={d}
                    overlayData={activeOverlay}
                    {...{
                      group,
                      options,
                      yAxisLabel,
                      tooltipAccessors,
                      tooltipUnits,
                      tooltipLabels,
                      preSelected,
                    }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <ConditionalWrapper
            condition={sources.length > 1}
            wrapper={children => (
              <NavDrawer
                cardClasses={drawerContainer}
                navItems={this.generateNavItems(groups)}
                contentClasses={paddedDrawerInner}
                toolbarStyles={{ display: 'none' }}
              >
                {children}
              </NavDrawer>
            )}
          >
            <h2 className="space-bottom">
              {activeGroup
                ? `${activeGroup.toUpperCase()} Type Classification `
                : 'Asteroid Class'}
            </h2>
            <AsteroidClass
              className="brightness-vs-distance"
              xAxisLabel={
                activeGroup
                  ? `${activeGroup.toUpperCase()} Class`
                  : 'Asteroid Class'
              }
              overlayData={activeOverlay}
              group={activeGroup}
              data={activeData}
              {...{
                options,
                yAxisLabel,
                tooltipAccessors,
                tooltipUnits,
                tooltipLabels,
                preSelected,
              }}
            />
          </ConditionalWrapper>
        )}
      </ConditionalWrapper>
    );
  }
}

AsteroidClassContainer.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  widget: PropTypes.object,
  answers: PropTypes.object,
  updateAnswer: PropTypes.func,
};

export default AsteroidClassContainer;
