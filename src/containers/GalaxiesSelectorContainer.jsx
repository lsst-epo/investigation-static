/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import GalaxySelector from '../components/charts/galaxySelector/index.jsx';

class GalaxiesSelectorContainer extends React.PureComponent {
  render() {
    const {
      options: { image },
    } = this.props;

    return (
      <>
        <h2 className="space-bottom">Galaxies Selector</h2>
        <div className="galaxies-selector-images--container">
          <GalaxySelector
            className="galaxies-selector"
            data={[
              {
                id: 'galaxy',
                name: 'ZTF19abqmpsr',
                color: '#1ab579',
                x: '700',
                y: '460',
              },
            ]}
            image={image}
          />
        </div>
      </>
    );
  }
}

GalaxiesSelectorContainer.propTypes = {
  options: PropTypes.object,
};

export default GalaxiesSelectorContainer;
