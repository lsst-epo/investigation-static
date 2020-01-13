/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavigationDrawer, Card, Toolbar, CardActions } from 'react-md';
import ScatterPlotSelectorContainer from './ScatterPlotSelectorContainer';
import GalaxySelector from '../components/charts/galaxySelector';
import ScatterPlot from '../components/site/icons/ScatterPlot';
import Star from '../components/site/icons/Star';
import ViewList from '../components/site/icons/ViewList';
import Close from '../components/site/icons/Close';
import Button from '../components/site/button';

import LightCurveContainer from './LightCurveContainer';

import './galaxy-selector-container.scss';
import { getActiveIndex } from '../components/charts/galaxySelector/galaxySelectorUtilities';

class GalaxySelectorContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    // const { sources } = props.widget;

    this.state = {
      openScatterPlot: false,
      openMenu: false,
      activeImageIndex: 0,
      selectedGalaxy: '',
      navItems: [],
      activeAlertId: null,
      activeAlert: null,
      data: [],
      images: [],
    };
  }

  componentDidMount() {
    axios.get('/data/galaxies/galaxy_selector.json').then(response => {
      const galaxies = response.data.map(source => {
        source.images = this.generateImages(source.name, source.alerts);
        return source;
      });

      const { name, alerts } = galaxies[0];

      this.setState(prevState => ({
        ...prevState,
        sources: response.data,
        selectedGalaxy: name,
        navItems: galaxies,
        activeAlertId: alerts[0].alert_id,
        activeAlert: alerts[0],
        data: [galaxies[0]],
        images: galaxies[0].images,
      }));
    });
  }

  chooseGalaxyAndCloseNav(event, galaxy) {
    if (event) {
      const { name, alerts } = galaxy;
      this.setState(prevState => ({
        ...prevState,
        selectedGalaxy: name,
        data: [galaxy],
        images: this.generateImages(name, alerts),
        activeImageIndex: 0,
        activeAlertId: alerts[0].alert_id,
        activeAlert: alerts[0],
      }));
      this.handleCloseMenu();
    }
  }

  getActiveImageIndex(activeAlert, activeImageIndex) {
    const { images } = this.state;

    if (activeAlert) {
      return getActiveIndex(images, activeAlert.image_id);
    }

    return activeImageIndex;
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
    const { selectedGalaxy } = this.state;
    const links = navItems.map(item => {
      const { name, color } = item;
      const isActive = name === selectedGalaxy;
      // Add complete/incomplete logic here
      const isComplete =
        name === 'ZTF19abqmpsr' ||
        name === 'ZTF19abqqmui' ||
        name === 'ZTF19abvhduf' ||
        name === 'ZTF19abucvgu';
      const isDisabled = name === 'ZTF19abucvgu'; // some cool logic to disable links
      return {
        leftAvatar: <Star style={{ fill: color }} />,
        primaryText: name,
        className: classnames(
          'galaxy-item',
          'link-item',
          isActive ? 'link-active' : '',
          isComplete ? 'link-is-complete' : 'link-is-not-complete',
          isDisabled ? 'link-is-disabled' : ''
        ), // boolean to add 'link-item'
        disabled: isDisabled,
        active: isActive, // default selected
        onClick: e => this.chooseGalaxyAndCloseNav(e, item),
      };
    });
    return links;
  };

  generateImages = (galaxyName, alerts) => {
    return alerts.map(alert => {
      return {
        id: alert.image_id,
        name: `/images/galaxies/${galaxyName}/${alert.image_id}_sci.jpeg`,
      };
    });
  };

  selectionCallback = () => {
    // console.log(d ? `${d[0].id} is selected` : 'no selection');
  };

  onAlertChange = update => {
    this.setState(
      prevState => ({
        ...prevState,
        ...update,
      }),
      () => {
        // const { activeAlertId } = this.state;
        // console.log(activeAlertId);
      }
    );
  };

  render() {
    const {
      activeAlert,
      activeImageId,
      activeImageIndex,
      data,
      navItems,
      openMenu,
      openScatterPlot,
      selectedGalaxy,
      images,
    } = this.state;

    return (
      <>
        <Toolbar
          className="galaxy-selector--toolbar"
          nav={
            !openMenu ? (
              <ViewList onClick={this.handleOpenMenu} />
            ) : (
              <Close onClick={this.handleCloseMenu} />
            )
          }
          title={selectedGalaxy || 'Galaxy Name 1'}
          actions={
            <Button
              primary
              flat
              iconBefore={false}
              onClick={e => this.triggerScatterPlot(e)}
              iconEl={!openScatterPlot ? <ScatterPlot /> : <Close />}
            >
              Hubble Plot
            </Button>
          }
        />
        <Card id="galaxy-selector" className="galaxy-selector-container">
          <NavigationDrawer
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
            <div className="galaxy-selector-images--container">
              <GalaxySelector
                className={`galaxy-selector-${data.name} ${data.band}-band`}
                data={data}
                images={images}
                selectionCallback={this.supernovaSelectionCallback}
                blinkCallback={this.onAlertChange}
                activeImageId={
                  activeAlert ? activeAlert.image_id : activeImageId
                }
                activeImageIndex={this.getActiveImageIndex(
                  activeAlert,
                  activeImageIndex
                )}
              />
            </div>
          </NavigationDrawer>

          <ScatterPlotSelectorContainer
            opened={openScatterPlot || false}
            handleClick={this.triggerScatterPlot}
          >
            <LightCurveContainer />
            <div className="actions">
              <Button raised>Add Trend Line</Button>
            </div>
          </ScatterPlotSelectorContainer>
          <CardActions centered>
            <Button flat>Previous Galaxy</Button>
            <Button primary flat>
              Next Galaxy
            </Button>
          </CardActions>
        </Card>
      </>
    );
  }
}

GalaxySelectorContainer.propTypes = {
  // widget: PropTypes.object,
  // sources: PropTypes.array,
};

export default props => <GalaxySelectorContainer {...props} />;
