import React from 'react';
import PropTypes from 'prop-types';
// import { CardActions } from 'react-md';
import Button from '../../site/button';

class GalaxySelectorNav extends React.PureComponent {
  render() {
    const { handlePrevGalaxy, handleNextGalaxy } = this.props;

    return (
      <div
        className="container-flex middle centered"
        style={{ marginTop: '20px' }}
      >
        <Button raised onClick={handlePrevGalaxy}>
          Previous Galaxy
        </Button>
        <Button primary raised onClick={handleNextGalaxy}>
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
