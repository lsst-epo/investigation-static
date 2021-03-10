import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../site/button';
import { toolbarButtons } from './galaxy-selector.module.scss';

class GalaxySelectorNav extends React.PureComponent {
  render() {
    const { handlePrevGalaxy, handleNextGalaxy } = this.props;

    return (
      <div className="container-flex middle centered">
        <Button raised onClick={handlePrevGalaxy} className={toolbarButtons}>
          Previous Galaxy
        </Button>
        <Button
          primary
          raised
          onClick={handleNextGalaxy}
          className={toolbarButtons}
        >
          Next Galaxy
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
