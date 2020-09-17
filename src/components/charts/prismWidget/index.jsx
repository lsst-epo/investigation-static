import React from 'react';
import Select from '../../site/selectField/index.jsx';
import ArrowDown from '../../site/icons/ArrowDown';

import {
  prismShape,
  whiteStreak,
  streak,
  prismClipWrapper,
  prismItems,
  prismColors,
  lens,
  cameraFilter,
  whiteCover,
  single,
  prismWrapper,
  contentWrapper,
  prismLabel,
  whiteLightLabel,
  prismSmallClipWrapper,
  prismSmallWrapper,
  prismSmallItems,
  prismSmallColors,
  whiteSmallCover,
  background,
  selectContainer,
  visibleRay,
  hiddenRay,
  stripe,
} from './prism-widget.module.scss';
import prismHexColors from '../../../assets/stylesheets/_variables.scss';

class PrismWidget extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedColor: '',
    };
  }

  handleSelect = value => {
    this.setState(prevState => ({
      ...prevState,
      selectedColor: value === 'None' ? '' : value,
    }));
  };

  getPrismColors(index) {
    return { backgroundColor: prismHexColors[`line${index}`] };
  }

  render() {
    const { selectedColor } = this.state;
    const colors = [
      'Red',
      'Orange',
      'Yellow',
      'Green',
      'Blue',
      'Indigo',
      'None',
    ];

    return (
      <div>
        <div className={contentWrapper}>
          <div className={background}></div>
          <div className={prismShape}>
            <div className={`${streak} ${whiteStreak}`}></div>
            <div className={prismSmallClipWrapper}>
              <div className={prismSmallWrapper}>
                <div className={prismSmallItems}>
                  {colors.map((color, i) => {
                    return (
                      <div
                        key={`div-${color}-lens`}
                        className={prismSmallColors}
                        name={color}
                        style={this.getPrismColors(i)}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={`${whiteSmallCover}`}></div>
            <div className={prismClipWrapper}>
              <div className={prismWrapper}>
                <div className={prismItems}>
                  {colors.map((color, i) => {
                    let rays = ``;
                    if (color === selectedColor) {
                      rays += `${visibleRay}`;
                    } else if (color !== '') {
                      rays += `${hiddenRay}`;
                    }

                    return (
                      <div
                        key={`div-${color}-lens`}
                        className={`${prismColors} ${rays}`}
                        name={color}
                        style={this.getPrismColors(i)}
                      ></div>
                    );
                  })}
                  {colors.map((color, i) => {
                    return (
                      <div
                        key={`div-${color}-lens`}
                        className={`${lens} ${
                          color === selectedColor ? stripe : cameraFilter
                        }`}
                        style={
                          color === selectedColor ? this.getPrismColors(i) : {}
                        }
                        id={color}
                      ></div>
                    );
                  })}
                  <div
                    className={`${lens} ${whiteCover}`}
                    style={selectedColor !== '' ? { display: 'block' } : {}}
                  ></div>
                  <div className={`${prismColors} ${single}`}></div>
                </div>
              </div>
            </div>
            <p className={prismLabel}>Prism</p>
            <p className={whiteLightLabel}>White Light → </p>
          </div>
        </div>
        <div className={selectContainer}>
          <Select
            dropdownIcon={<ArrowDown />}
            id="color-select"
            placeholder="Select a filter"
            className="set-white-color"
            value={selectedColor}
            menuItems={colors}
            onChange={this.handleSelect}
            block
            position="top left"
            fullWidth
            simplifiedMenu={false}
            listStyle={{
              left: 0,
              top: '100%',
              width: '100%',
              minWidth: '150px',
              // transform: 'translateY(0)',
            }}
          />
        </div>
      </div>
    );
  }
}

export default PrismWidget;
