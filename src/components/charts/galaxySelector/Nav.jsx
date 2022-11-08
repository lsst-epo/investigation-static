import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'gatsby-plugin-react-i18next';
import Button from '../../site/button';
import { toolbarButtons } from './galaxy-selector.module.scss';

class GalaxySelectorNav extends React.PureComponent {
  render() {
    const { handlePrevGalaxy, handleNextGalaxy } = this.props;

    return (
      <div className="container-flex middle centered">
        <Button raised onClick={handlePrevGalaxy} className={toolbarButtons}>
          <Trans>widgets::galaxy_selector.actions.previous</Trans>
        </Button>
        <Button
          primary
          raised
          onClick={handleNextGalaxy}
          className={toolbarButtons}
        >
          <Trans>widgets::galaxy_selector.actions.next</Trans>
        </Button>
      </div>
    );
  }
}

export default GalaxySelectorNav;

GalaxySelectorNav.propTypes = {
  handlePrevGalaxy: PropTypes.func,
  handleNextGalaxy: PropTypes.func,
};
