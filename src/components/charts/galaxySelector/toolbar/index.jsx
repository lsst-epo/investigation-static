import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar } from 'react-md';
import ScatterPlot from '../../../site/icons/ScatterPlot';
import ViewList from '../../../site/icons/ViewList';
import Close from '../../../site/icons/Close';
import Button from '../../../site/button';

import styles from './toolbar-styles.module.scss';

class GalaxySelectorToolbar extends React.PureComponent {
  render() {
    const {
      activeGalaxy,
      onMenuOpen,
      onMenuClose,
      scatterPlotTrigger,
      openScatterPlot,
      openMenu,
    } = this.props;

    return (
      <Toolbar
        className={styles.toolbar}
        nav={
          openMenu ? (
            <Close onClick={onMenuClose} />
          ) : (
            <ViewList onClick={onMenuOpen} />
          )
        }
        title={activeGalaxy ? activeGalaxy.name : 'Galaxy Selector'}
        actions={
          <Button
            primary
            flat
            iconBefore={false}
            onClick={e => scatterPlotTrigger(e)}
            iconEl={!openScatterPlot ? <ScatterPlot /> : <Close />}
          >
            Hubble Plot
          </Button>
        }
      />
    );
  }
}
export default GalaxySelectorToolbar;

GalaxySelectorToolbar.propTypes = {
  activeGalaxy: PropTypes.object,
  onMenuOpen: PropTypes.func,
  onMenuClose: PropTypes.func,
  scatterPlotTrigger: PropTypes.func,
  openScatterPlot: PropTypes.bool,
  openMenu: PropTypes.bool,
};
