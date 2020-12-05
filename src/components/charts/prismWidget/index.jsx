import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
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
  filterLabel,
  prismLabel,
  whiteLightLabel,
  hideLabel,
  prismSmallClipWrapper,
  prismSmallWrapper,
  prismSmallItems,
  prismSmallColors,
  background,
  selectContainer,
  selectLabel,
  visibleRay,
  hiddenRay,
  stripe,
  blackColors,
  blackSmallColors,
  blackCover,
} from './prism-widget.module.scss';
import prismHexColors from '../../../assets/stylesheets/_variables.scss';

class PrismWidget extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedColor: 'None',
    };
  }

  componentDidMount() {
    const { selectedColor } = this.props;

    this.setState(prevState => ({
      ...prevState,
      selectedColor,
    }));
  }

  handleSelect = value => {
    this.updateAnswers(value);
  };

  getPrismColors(index) {
    if (index === 6) return { backgroundColor: 'transparent' };
    return { backgroundColor: prismHexColors[`line${index}`] };
  }

  updateAnswers = value => {
    this.setState(
      prevState => ({
        ...prevState,
        selectedColor: value,
      }),
      () => {
        const { selectionCallback } = this.props;
        const { selectedColor } = this.state;
        if (selectionCallback) {
          selectionCallback(selectedColor);
        }
      }
    );
  };

  render() {
    const { selectedColor } = this.state;
    const colors = [
      'Red',
      'Orange',
      'Yellow',
      'Green',
      'Blue',
      'Violet',
      'None',
    ];

    return (
      <div>
        <h2>Filter Tool</h2>
        <div className={contentWrapper}>
          <div className={background}></div>
          <div className={prismShape}>
            <div className={`${streak} ${whiteStreak}`}></div>
            <div className={prismSmallClipWrapper}>
              <div className={prismSmallWrapper}>
                <div className={prismSmallItems}>
                  {colors.map((color, i) => {
                    return (
                      <>
                        <div
                          key={`div-${color}-lens`}
                          className={prismSmallColors}
                          name={color}
                          style={this.getPrismColors(i)}
                        ></div>
                        {/* {i < 5 && (
                          <div
                            key={`div-${color}-blacklens`}
                            className={`${blackSmallColors} ${hiddenRay}`}
                            name={color}
                          ></div>
                        )} */}
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={`${blackCover}`}></div>
            <div className={prismClipWrapper}>
              <div className={prismWrapper}>
                <div className={prismItems}>
                  {colors.map((color, i) => {
                    let rays = ``;
                    if (color === selectedColor) {
                      rays += `${visibleRay}`;
                    } else if (color !== 'None') {
                      rays += `${hiddenRay}`;
                    }

                    return (
                      <>
                        <div
                          key={`div-${color}-lens`}
                          className={`${prismColors} ${rays}`}
                          name={color}
                          style={this.getPrismColors(i)}
                        ></div>
                        {i < 5 && (
                          <div
                            key={`div-${color}-blacklens`}
                            className={`${blackColors} ${hiddenRay}`}
                            name={color}
                          ></div>
                        )}
                      </>
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
                    style={selectedColor !== 'None' ? { display: 'block' } : {}}
                  ></div>
                  <div className={`${prismColors} ${single}`}></div>
                </div>
              </div>
            </div>
            <p
              className={classnames(filterLabel, {
                [hideLabel]: selectedColor === 'None',
              })}
            >
              Filter
            </p>
            <p className={prismLabel}>Prism</p>
            <p className={whiteLightLabel}>White Light → </p>
          </div>
        </div>
        <div className={selectContainer}>
          <p className={selectLabel}>Select a filter:</p>
          <Select
            dropdownIcon={<ArrowDown />}
            id="color-select"
            className="set-white-color"
            menuItems={colors}
            onChange={this.handleSelect}
            value={selectedColor}
            block
            position="top left"
            fullWidth
            simplifiedMenu={false}
            listStyle={{
              left: 0,
              top: '100%',
              width: '100%',
              minWidth: '150px',
            }}
          />
        </div>
      </div>
    );
  }
}

PrismWidget.propTypes = {
  selectionCallback: PropTypes.func,
  selectedColor: PropTypes.string,
};

export default PrismWidget;
