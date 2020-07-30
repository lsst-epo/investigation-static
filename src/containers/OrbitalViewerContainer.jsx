import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import API from '../lib/API.js';
import ConditionalWrapper from '../components/ConditionalWrapper';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import OrbitalViewer from '../components/visualizations/orbitalViewer/index.jsx';

import {
  avatarContainer,
  navAvatar,
  container,
  mainContent,
} from '../components/charts/shared/navDrawer/nav-drawer.module.scss';
import {
  activeItem,
  navItem,
  paddedDrawerInner,
} from '../components/visualizations/orbitalViewer/orbital-viewer.module.scss';

class OrbitalViewerContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      activeNavIndex: null,
      activeNeo: null,
    };
  }

  componentDidMount() {
    const { widget, options } = this.props;
    const { source } = widget;
    const { multiple, showUserPlot } = options || {};

    if (source) {
      API.get(source).then(response => {
        const { data } = response;
        const activeNavIndex = multiple ? 0 : null;
        const neos = multiple ? data[activeNavIndex].data : data;

        this.setState(prevState => ({
          ...prevState,
          data,
          activeNavIndex,
          activeNeo: neos.length === 1 ? neos[0] : null,
        }));
      });
    } else if (showUserPlot) {
      const data = this.getOrbitAnswerData();

      this.setState(prevState => ({
        ...prevState,
        data: data ? [data] : null,
        activeNeo: data,
      }));
    }
  }

  getExtentIndices(data, accessor) {
    return [minBy(data, accessor), maxBy(data, accessor)];
  }

  getOrbitExtents(data) {
    return [
      ...new Set(
        ['a']
          .map(accessor => {
            return this.getExtentIndices(data, accessor);
          })
          .flat()
      ),
    ];
  }

  getOrbitAnswerData() {
    const { options, answers } = this.props;
    const { showUserPlot: qId } = options || {};
    const answer = answers[qId];

    return answer ? answer.data.orbit : null;
  }

  updateActiveNavItem(itemIndex) {
    const { data } = this.state;
    const { options } = this.props;
    const { multiple } = options || {};
    const neos = multiple ? data[itemIndex].data : data;

    this.setState(prevState => ({
      ...prevState,
      activeNavIndex: itemIndex,
      activeNeo: neos.length === 1 ? neos[0] : null,
    }));
  }

  generateNavItems(navItems) {
    if (!navItems) return [];
    return navItems.map((item, i) => {
      const { name } = item;
      const { activeNavIndex } = this.state;

      return {
        leftAvatar: (
          <div className={avatarContainer}>
            <div className={navAvatar}>{name}</div>
          </div>
        ),
        className: classnames(navItem, {
          [activeItem]: activeNavIndex === i,
        }),
        primaryText: ' ',
        onClick: () => this.updateActiveNavItem(i),
      };
    });
  }

  updateActiveNeo = activeNeo => {
    const { options } = this.props;
    const { preSelected } = options || {};

    if (!preSelected) {
      this.setState(prevState => ({
        ...prevState,
        activeNeo,
      }));
    }
  };

  render() {
    const { data, activeNavIndex, activeNeo } = this.state;
    const { options } = this.props;
    const { multiple, title, potentialOrbits } = options || {};

    return (
      <>
        {!multiple && (
          <h2 className="space-bottom">{title || 'Orbit Viewer'}</h2>
        )}
        <ConditionalWrapper
          condition={multiple}
          wrapper={children => (
            <NavDrawer
              interactableToolbar
              toolbarTitle={`${data ? data[activeNavIndex].name : ''}`}
              cardClasses={container}
              navItems={this.generateNavItems(data)}
              contentClasses={mainContent}
            >
              <div className={paddedDrawerInner}>{children}</div>
            </NavDrawer>
          )}
        >
          {data && (
            <OrbitalViewer
              potentialOrbits={potentialOrbits}
              neos={multiple ? data[activeNavIndex].data : data}
              updateActiveNeo={this.updateActiveNeo}
              activeNeo={activeNeo}
              {...options}
            />
          )}
        </ConditionalWrapper>
      </>
    );
  }
}

OrbitalViewerContainer.propTypes = {
  widget: PropTypes.object,
  options: PropTypes.object,
  answers: PropTypes.object,
};

export default OrbitalViewerContainer;
