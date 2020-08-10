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
} from './prism-widget.module.scss';

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
      selectedColor: value,
    }));
  };

  render() {
    const { selectedColor } = this.state;
    const colors = [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'indigo',
      'violet',
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
                  {colors.map(color => {
                    const styling = { backgroundColor: color };
                    return (
                      <div
                        key={`div-${color}-lens`}
                        className={prismSmallColors}
                        name={color}
                        style={styling}
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
                  {colors.map(color => {
                    let styling = { backgroundColor: color };
                    if (color === selectedColor) {
                      styling = {
                        backgroundColor: color,
                        zIndex: 3,
                      };
                    } else if (color !== '') {
                      styling = {
                        backgroundColor: color,
                        zIndex: 0,
                      };
                    }
                    return (
                      <div
                        key={`div-${color}-lens`}
                        className={prismColors}
                        name={color}
                        style={styling}
                      ></div>
                    );
                  })}
                  {colors.map(color => {
                    let styling = {};
                    if (color === selectedColor) {
                      styling = {
                        visibility: 'visible',
                        opacity: 1,
                        top: '-36px',
                        transition: 'all 1.2s ease 0s',
                        zIndex: 1,
                        backgroundColor: `${color}`,
                      };
                    }
                    return (
                      <div
                        key={`div-${color}-lens`}
                        className={`${lens} ${cameraFilter}`}
                        style={styling}
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
        <Select
          dropdownIcon={<ArrowDown />}
          id="color-select"
          placeholder="None"
          menuItems={colors}
          onChange={this.handleSelect}
        />
      </div>
    );
  }
}

export default PrismWidget;
