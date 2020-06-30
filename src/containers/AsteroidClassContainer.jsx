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
  mainContent,
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
      group: null,
      twoUp: false,
      activeOverlay: null,
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
            group: data.map(d => d.group),
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
          group,
          twoUp: false,
        }));
      });
    } else if (source && sources) {
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

  generateNavItems(navItems) {
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
    const { data, overlayData, activeOverlay, group, twoUp } = this.state;
    const { options } = this.props;
    const {
      yAxisLabel,
      tooltipAccessors,
      tooltipUnits,
      tooltipLabels,
      preSelected,
      multiple,
    } = options || {};

    return (
      <ConditionalWrapper
        condition={multiple && !!overlayData}
        wrapper={children => (
          <NavDrawer
            cardClasses={drawerContainer}
            navItems={this.generateNavItems(overlayData)}
            contentClasses={mainContent}
            toolbarStyles={{ display: 'none' }}
          >
            <div className={paddedDrawerInner}>{children}</div>
          </NavDrawer>
        )}
      >
        {twoUp ? (
          <div className="container-flex">
            {data.map((d, i) => {
              const dGroup = group[i] ? group[i].toUpperCase() : null;

              return (
                <div key={`${dGroup}`} className="col-width-50">
                  <h2 className="space-bottom">
                    {dGroup
                      ? `${dGroup} Type Classification`
                      : 'Asteroid Class'}
                  </h2>
                  <AsteroidClass
                    className="brightness-vs-distance"
                    xAxisLabel={dGroup ? `${dGroup} Class` : 'Asteroid Class'}
                    group={dGroup}
                    data={d}
                    overlayData={activeOverlay}
                    {...{
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
          <div>
            <h2 className="space-bottom">
              {group
                ? `${group.toUpperCase()} Type Classification `
                : 'Asteroid Class'}
            </h2>
            <AsteroidClass
              className="brightness-vs-distance"
              xAxisLabel={
                group ? `${group.toUpperCase()} Class` : 'Asteroid Class'
              }
              overlayData={activeOverlay}
              {...{
                data,
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
