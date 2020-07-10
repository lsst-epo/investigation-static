import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../site/button/index.js';
import { redBtn } from '../../site/button/styles.module.scss';
import {
  groupLayout,
  colorImage,
  button,
  buttonClicked,
} from './color-tool.module.scss';
import greenPic from '../../../../static/images/green-filter.png';
import redPic from '../../../../static/images/red-filter.png';
import bluePic from '../../../../static/images/blue-filter.png';

class ColorTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showImage: false,
      imgSrc: null,
      greenIsClick: false,
      redIsClick: false,
      blueIsClick: false,
    };
  }

  handleImage(color, clickValue) {
    const src =
      color === 'red' ? redPic : color === 'blue' ? bluePic : greenPic;
    this.setState(prevState => ({
      ...prevState,
      showImage: true,
      imgSrc: src,
      [clickValue]: !prevState[clickValue],
    }));
  }

  render() {
    const { options } = this.props;
    const {
      showImage,
      imgSrc,
      greenIsClick,
      redIsClick,
      blueIsClick,
    } = this.state;

    return (
      <div>
        {showImage && <img className={colorImage} alt="img" src={imgSrc} />}
        <div>
          <Button
            floating
            className={redIsClick ? buttonClicked : button}
            onClick={() => this.handleImage('red', 'redIsClick')}
          >
            R
          </Button>
          <Button
            floating
            className={blueIsClick ? buttonClicked : button}
            onClick={() => this.handleImage('blue', 'blueIsClick')}
          >
            B
          </Button>
          <Button
            floating
            className={greenIsClick ? buttonClicked : button}
            onClick={() => this.handleImage('green', 'greenIsClick')}
          >
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
