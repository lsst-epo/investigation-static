/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import API from '../lib/API.js';
import GalaxySelector from '../components/charts/galaxySelector/index.jsx';

class GalaxiesSelectorContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      imagePath: null,
      domain: [],
    };
  }

  componentDidMount() {
    const {
      widget: { source },
    } = this.props;

    API.get(source).then(response => {
      const {
        data: { objects, ra, dec },
      } = response;
      const name = this.getName(source);

      this.setState(prevState => ({
        ...prevState,
        data: objects,
        imagePath: `/images/galaxies/hsc/${name}.png`,
        name,
        domain: [ra.reverse(), dec],
      }));
    });
  }

  getName(source) {
    return source
      .split('/')
      .pop()
      .split('.')[0];
  }

  render() {
    const { imagePath, data, name, domain } = this.state;
    console.log(domain);
    return (
      <>
        <h2 className="space-bottom">Galaxies Selector</h2>
        <div className="galaxies-selector-images--container">
          <GalaxySelector
            className="galaxies-selector"
            data={data}
            image={{ mediaPath: imagePath, altText: name }}
            xDomain={domain[0]}
            yDomain={domain[1]}
          />
        </div>
      </>
    );
  }
}

GalaxiesSelectorContainer.propTypes = {
  // options: PropTypes.object,
  widget: PropTypes.object,
};

export default GalaxiesSelectorContainer;
