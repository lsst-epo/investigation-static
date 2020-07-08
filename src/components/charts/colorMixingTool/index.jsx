import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../site/button/index.js';
import { groupLayout, colorImage } from './color-tool.module.scss';
import picture from '../../../../static/images/bayer_filter.png';

class ColorTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showImage: false,
    };
  }

  handleImage = () => {
    this.setState(prevState => ({
      ...prevState,
      showImage: true,
    }));
  };

  render() {
    const { options } = this.props;
    const { showImage } = this.state;
    console.log(showImage);
    return (
      <div className={groupLayout}>
        {showImage && <img className={colorImage} alt="img" src={picture} />}
        <div>
          <Button floating onClick={this.handleImage}>
            R
          </Button>
          <Button floating onClick={this.handleImage}>
            B
          </Button>
          <Button floating onClick={this.handleImage}>
            G
          </Button>
        </div>
      </div>
    );
  }
}

ColorTool.propTypes = {
  options: PropTypes.object,
};

export default ColorTool;
