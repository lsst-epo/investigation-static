import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import classnames from 'classnames';
import { NavigationDrawer, Card, Toolbar } from 'react-md';
import ScatterPlotSelectorContainer from './ScatterPlotSelectorContainer';
import Star from '../components/site/icons/Star';
import Menu from '../components/site/icons/Menu';
import Close from '../components/site/icons/Close';
import Button from '../components/site/button';

import LightCurveContainer from './LightCurveContainer';

import './galaxy-selector-container.scss';

class GalaxySelector extends React.PureComponent {
  constructor(props) {
    super(props);

    // if (!window.location.hash) window.location.hash = `galaxy-1`;

    const { sources } = props.widget;

    // axios.all(sources.map(source => axios.get( `${source}` ) ));

    this.state = {
      openScatterPlot: false,
      openMenu: false,
      selectedGalaxy: null,
      navItems: [
        {
          galaxyId: 'galaxy-1',
          name: 'Galaxy Name 1',
        },
        {
          galaxyId: 'galaxy-2',
          name: 'Galaxy Name 2',
        },
        {
          galaxyId: 'galaxy-3',
          name: 'Galaxy Name 3',
        },
        {
          galaxyId: 'galaxy-4',
          name: 'Galaxy Name 4',
        },
        {
          galaxyId: 'galaxy-5',
          name: 'Galaxy Name 5',
        },
        {
          galaxyId: 'galaxy-6',
          name: 'Galaxy Name 6',
        },
      ],
    };
  }

  chooseGalaxyAndCloseNav(event, galaxyId) {
    // logic to load selected galaxy using galaxyId
    // apply to this.state.selectedGalaxy
    if (event) {
      console.log(galaxyId);
      this.handleCloseMenu();
    }
  }

  handleOpenMenu = () => {
    this.setState(prevState => ({
      ...prevState,
      openMenu: true,
    }));
  };

  handleCloseMenu = () => {
    this.setState(prevState => ({
      ...prevState,
      openMenu: false,
    }));
  };

  handleLeftNavigationDrawerVisibility = leftNavigationDrawerVisibility => {
    this.setState(prevState => ({
      ...prevState,
      openMenu: leftNavigationDrawerVisibility,
    }));
  };

  triggerScatterPlot = event => {
    if (event) {
      this.setState(prevState => ({
        ...prevState,
        openScatterPlot: !prevState.openScatterPlot,
      }));
    }
  };

  generateNavItems = navItems => {
    const links = navItems.map(item => {
      const isActive = false;
      return {
        leftAvatar: <Star />,
        primaryText: item.name,
        className: classnames('galaxy-item', isActive ? 'link-item' : ''), // boolean to add 'link-item'
        active: isActive, // default selected
        onClick: e => this.chooseGalaxyAndCloseNav(e, item.galaxyId),
      };
    });
    return links;
  };

  render() {
    const { navItems, openMenu, openScatterPlot, selectedGalaxy } = this.state;
    // const renderNode = document.querySelector(`#galaxy-selector-${selectorId}`);
    return (
      <>
        <Toolbar
          className="galaxy-selector--toolbar"
          nav={
            !openMenu ? (
              <Menu onClick={this.handleOpenMenu} />
            ) : (
              <Close onClick={this.handleCloseMenu} />
            )
          }
          title={selectedGalaxy || 'Galaxy Name 1'}
        />
        <Card id="galaxy-selector" className="galaxy-selector-container">
          <NavigationDrawer
            // renderNode={renderNode}
            navItems={this.generateNavItems(navItems)}
            position="left"
            className="galaxy-selector--navigation-drawer"
            visible={openMenu}
            onVisibilityChange={this.handleLeftNavigationDrawerVisibility}
            mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
            tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
            desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
            contentClassName="main-galaxy-selector-content"
            overlay={false}
          >
            <div className="galaxy-selector-cont">
              <p>
                Click button below to trigger the scatter plot on the right.
              </p>
              <p>
                <i>
                  Note: This can be used to toggle the scatter plot
                  programmatically, as well.
                </i>
              </p>
            </div>
            <br />
            <Button secondary onClick={e => this.triggerScatterPlot(e)} raised>
              Open Scatter Plot
            </Button>
          </NavigationDrawer>

          <ScatterPlotSelectorContainer
            opened={openScatterPlot || false}
            handleClick={this.triggerScatterPlot}
          >
            <LightCurveContainer />
          </ScatterPlotSelectorContainer>
        </Card>
      </>
    );
  }
}

GalaxySelector.propTypes = {
  widget: PropTypes.object,
  sources: PropTypes.array,
};

export default props => {
  return <GalaxySelector {...props} />;
};
