import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import classnames from 'classnames';
import API from '../lib/API.js';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import HubblePlot from '../components/charts/hubblePlot/index.jsx';
import GalaxiesPosition3D from '../components/charts/galaxiesPosition3D/index.jsx';
import Star from '../components/site/icons/Star';
import { getHubblePlotData } from '../components/charts/hubblePlot/hubblePlotUtilities.js';

import {
  drawerContainer,
  scrambleItem,
  linkActive,
} from '../components/charts/hubblePlot/hubble-plot.module.scss';
import { paddedDrawerInner } from '../components/charts/shared/navDrawer/nav-drawer.module.scss';

class GalaxyScramblerContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      activeGalaxy: null,
      navItems: [],
    };
  }

  componentDidMount() {
    const { options, answers, widget } = this.props;
    const { source } = widget || {};

    API.get(source).then(response => {
      const scrambles = getHubblePlotData(response.data, options, answers);
      const activeScramble = scrambles[0];
      const { data, name } = activeScramble;
      const activeGalaxy = this.getGalaxyFromName(data, name);
      this.setState(prevState => ({
        ...prevState,
        data,
        scrambles,
        activeScramble,
        activeGalaxy,
        navItems: this.generateNavItems(scrambles, activeScramble),
      }));
    });
  }

  getGalaxyFromName(galaxies, name) {
    return find(galaxies, { name });
  }

  setActiveScramble = activeScramble => {
    const { scrambles } = this.state;
    const { data, name } = activeScramble;

    this.setState(prevState => ({
      ...prevState,
      data,
      activeScramble,
      activeGalaxy: this.getGalaxyFromName(data, name),
      navItems: this.generateNavItems(scrambles, activeScramble),
    }));
  };

  hubbleSelectionCallback = d => {
    console.log(d); // eslint-disable-line no-console
  };

  userHubblePlotCallback = (qId, data) => {
    const { updateAnswer } = this.props;

    updateAnswer(qId, data);

    this.setState(prevState => ({
      ...prevState,
      data,
    }));
  };

  getHubbleConstant(qId) {
    const { answers } = this.props;
    const answer = answers[qId];

    if (!isEmpty(answer)) {
      return answer.data;
    }

    return null;
  }

  generateNavItems(scrambles, activeScramble) {
    return scrambles.map(scramble => {
      const { name, color } = scramble;
      return {
        leftAvatar: (
          <span>
            <Star style={{ fill: color }} />
            <span className="screen-reader-only">{name}</span>
          </span>
        ),
        primaryText: name,
        className: classnames(scrambleItem, {
          [linkActive]: activeScramble.name === scramble.name,
        }),
        onClick: () => this.setActiveScramble(scramble),
      };
    });
  }

  render() {
    const { data, navItems, activeScramble } = this.state;
    const { options } = this.props;
    const { hubbleConstant } = options || {};

    return (
      <>
        <NavDrawer
          interactableToolbar
          cardClasses={drawerContainer}
          contentClasses={paddedDrawerInner}
          navItems={navItems}
          toolbarTitle={
            activeScramble ? `${activeScramble.name}` : 'Galaxy Scrambler'
          }
        >
          <div className="container-flex spaced">
            <div className="col padded col-width-50">
              <HubblePlot
                className="hubble-plot"
                {...{
                  data,
                  options,
                  hubbleConstant,
                }}
                selectionCallback={this.hubbleSelectionCallback}
              />
            </div>
            <div className="col padded col-width-50">
              <GalaxiesPosition3D
                className="galaxies-position"
                {...{
                  data,
                  options,
                }}
                selectionCallback={this.hubbleSelectionCallback}
              />
            </div>
          </div>
        </NavDrawer>
      </>
    );
  }
}

GalaxyScramblerContainer.propTypes = {
  data: PropTypes.object,
  widget: PropTypes.object,
  options: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  activeAnswer: PropTypes.object,
  updateAnswer: PropTypes.func,
};

export default GalaxyScramblerContainer;
