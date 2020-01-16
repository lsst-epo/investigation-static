import React from 'react';
import PropTypes from 'prop-types';
import { CardActions } from 'react-md';
import Button from '../../site/button';

class GalaxySelectorNav extends React.PureComponent {
  render() {
    const { handlePrevGalaxy, handleNextGalaxy } = this.props;

    return (
      <CardActions centered>
        <Button flat onClick={handlePrevGalaxy}>
          Previous Galaxy
        </Button>
        <Button primary flat onClick={handleNextGalaxy}>
          Next Galaxy
        </Button>
      </CardActions>
    );
  }
}

export default GalaxySelectorNav;

GalaxySelectorNav.propTypes = {
  handlePrevGalaxy: PropTypes.func,
  handleNextGalaxy: PropTypes.func,
};
