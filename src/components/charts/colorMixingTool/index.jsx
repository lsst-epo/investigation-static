import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../../site/button/index.js';
import {
  colorImage,
  button,
  active,
  col50,
  imagesContainer,
  buttonContainer,
} from './color-tool.module.scss';

class ColorTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showImage: false,
      imgSrc: null,
      greenIsActive: false,
      redIsActive: false,
      blueIsActive: false,
    };
  }

  handleImage(color, src) {
    const stateName = color + 'IsActive';
    this.setState(prevState => ({
      ...prevState,
      showImage: true,
      imgSrc: src,
      [stateName]: !prevState[stateName],
    }));
  }

  render() {
    const { data } = this.props;
    const {
      showImage,
      imgSrc,
      greenIsActive,
      redIsActive,
      blueIsActive,
    } = this.state;

    const activeFilters = {
      green: greenIsActive,
      red: redIsActive,
      blue: blueIsActive,
    };

    return (
      <div className="container-flex">
        <div className={`${buttonContainer} ${col50}`}>
          {data &&
            data.map((btn, i) => {
              const key = `button-${i}`;
              const isActive = activeFilters[btn.color];
              return (
                <Button
                  key={key}
                  floating
                  className={classnames(button, { [active]: isActive })}
                  onClick={() => this.handleImage(btn.color, btn.img)}
                >
                  {btn.label}
                </Button>
              );
            })}
        </div>
        <div className={`${imagesContainer} ${col50}`}>
          {showImage && <img className={colorImage} alt="img" src={imgSrc} />}
        </div>
      </div>
    );
  }
}

ColorTool.propTypes = {
  data: PropTypes.array,
};

export default ColorTool;
