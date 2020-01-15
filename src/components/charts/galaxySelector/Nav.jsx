import React from 'react';
import PropTypes from 'prop-types';
import { CardActions } from 'react-md';
import Button from '../../site/button';

class GalaxySelectorNav extends React.PureComponent {
  render() {
    const { onPrevGalaxy, onNextGalaxy } = this.props;

    return (
      <CardActions centered>
        <Button flat onClick={onPrevGalaxy}>
          Previous Galaxy
        </Button>
        <Button primary flat onClick={onNextGalaxy}>
          Next Galaxy
        </Button>
      </CardActions>
    );
  }
}

export default GalaxySelectorNav;

GalaxySelectorNav.propTypes = {
  onPrevGalaxy: PropTypes.func,
  onNextGalaxy: PropTypes.func,
};
