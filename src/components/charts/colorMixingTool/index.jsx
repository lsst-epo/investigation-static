import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SliderCustom from '../../site/slider/index.jsx';
import Select from '../../site/selectField/index.jsx';
import Button from '../../site/button/index.js';
import ArrowDown from '../../site/icons/ArrowDown';

import {
  filter,
  filterActive,
  selectContainer,
  button,
  active,
  col50,
  buttonContainer,
  sliderContainer,
  container,
  resetBtn,
  imagesContainer,
} from './color-tool.module.scss';

class ColorTool extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      filters: [],
      colorOptions: [],
      hexColors: [],
      galaxies: null,
      resetBtnActive: false,
      panelIsActive: false,
    };
  }

  componentDidMount() {
    const { filters, colorOptions, hexColors, galaxies } = this.props;

    this.setState(prevState => ({
      ...prevState,
      filters,
      colorOptions,
      hexColors,
      galaxies,
      resetBtnActive: false,
    }));
  }

  handleImage(btnObj) {
    const { filters } = this.state;
    const { active: oldActive } = btnObj;

    const newFilters = filters.map(newFilter => {
      if (newFilter.label === btnObj.label) {
        newFilter.active = !oldActive;
      }
      return newFilter;
    });

    this.setState(prevState => ({
      ...prevState,
      filters: newFilters,
      resetBtnActive: true,
    }));
  }

  handleColorChange = (value, index, event, { id }) => {
    const { filters } = this.state;
    const newFilters = filters.map(newFilter => {
      if (newFilter.label === id) {
        newFilter.color = value;
      }
      return newFilter;
    });

    this.setState(prevState => ({
      ...prevState,
      filters: newFilters,
      resetBtnActive: true,
    }));
  };

  handleReset = () => {
    const { filters } = this.state;
    const newFilters = filters.map(newFilter => {
      newFilter.color = '';
      newFilter.active = false;
      newFilter.brightness = 0.7;
      return newFilter;
    });

    this.setState(prevState => ({
      ...prevState,
      filters: newFilters,
      resetBtnActive: false,
    }));
  };

  handleBrightness(value, label) {
    const { filters } = this.state;
    const newFilters = filters.map(newFilter => {
      if (newFilter.label === label) {
        newFilter.brightness = 0.8 * (value / 100) + 0.7;
      }
      return newFilter;
    });

    this.setState(prevState => ({
      ...prevState,
      filters: newFilters,
    }));
  }

  handleSelectChange(value) {
    const id = value.charAt(0);
    const { filters } = this.state;
    const newFilters = filters.map(newFilter => {
      if (newFilter.label === id) {
        newFilter.color = value;
      }
      return newFilter;
    });

    this.setState(prevState => ({
      ...prevState,
      filters: newFilters,
      resetBtnActive: true,
    }));
  }

  getColorBlocks() {
    const { colorOptions } = this.state;
    return colorOptions.map(color => {
      return {
        label: color,
        value: color,
      };
    });
  }

  handleGalaxySelection = value => {
    const { filters } = this.state;

    const newFilters = filters.map(newFilter => {
      newFilter.image = `${value.toLowerCase()}-${newFilter.label.toLowerCase()}.png`;
      return newFilter;
    });

    this.setState(prevState => ({
      ...prevState,
      filters: newFilters,
    }));
  };

  handleControlPanel = () => {
    this.setState(prevState => ({
      ...prevState,
      panelIsActive: !prevState.panelIsActive,
    }));
  };

  render() {
    const { filters, resetBtnActive, panelIsActive, galaxies } = this.state;
    const panelClassName = classnames(button, {
      [active]: panelIsActive,
    });
    const visibilityVal = panelIsActive ? 'visible' : 'hidden';

    return (
      <div className={`container-flex ${container}`}>
        <div className={`${buttonContainer} ${col50}`}>
          {galaxies && filters && (
            <div className={container}>
              <Select
                dropdownIcon={<ArrowDown />}
                id="galaxy-selector"
                placeholder="Selected Galaxy:"
                menuItems={galaxies}
                onChange={this.handleGalaxySelection}
              />
            </div>
          )}
          {filters &&
            filters.map((btn, i) => {
              const key = `div-${i}`;
              const btnClassName = classnames(button, {
                [active]: btn.active,
              });
              return (
                <div key={key} className={selectContainer}>
                  <Button
                    floating
                    style={{ visibility: `${visibilityVal}` }}
                    className={btnClassName}
                    onClick={() => this.handleImage(btn)}
                  >
                    {btn.label}
                  </Button>
                  <Select
                    dropdownIcon={<ArrowDown />}
                    id={btn.label}
                    placeholder="None"
                    style={{ visibility: `${visibilityVal}` }}
                    value={btn.color}
                    menuItems={this.getColorBlocks()}
                    onChange={this.handleColorChange}
                  />
                  <div className={sliderContainer}>
                    <SliderCustom
                      id={btn.label}
                      style={{ visibility: `${visibilityVal}` }}
                      className={
                        btn.color !== ''
                          ? `fill-color-${btn.color.toLowerCase()}`
                          : ''
                      }
                      min={0.7}
                      max={1.5}
                      value={btn.brightness || 0.7}
                      disabled={!btn.active}
                      onChange={value =>
                        this.handleBrightness(value, btn.label)
                      }
                    />
                  </div>
                </div>
              );
            })}
          <Button
            raised
            primary
            style={{ visibility: `${visibilityVal}` }}
            disabled={!resetBtnActive}
            className={resetBtn}
            onClick={this.handleReset}
          >
            Reset
          </Button>
        </div>
        <Button
          floating
          className={panelClassName}
          onClick={this.handleControlPanel}
        >
          {panelIsActive ? 'Off' : 'On'}
        </Button>
        {filters &&
          filters.map(filterImage => {
            const imageClassName = classnames(filter, {
              [filterActive]: filterImage.active,
            });
            let opacityVal = 0;
            if (filterImage.active && !panelIsActive) {
              opacityVal = 1;
            } else if (filterImage.active && panelIsActive) {
              opacityVal = 0.3;
            }

            return (
              <div
                key={`filter-${filterImage.label}`}
                style={{
                  opacity: `${opacityVal}`,
                  backgroundImage: `url(/images/${filterImage.image}`,
                  backgroundColor: filterImage.color,
                  filter: `brightness(${filterImage.brightness})`,
                }}
                className={imageClassName}
              ></div>
            );
          })}
      </div>
    );
  }
}

ColorTool.propTypes = {
  filters: PropTypes.array,
  colorOptions: PropTypes.array,
  hexColors: PropTypes.array,
  galaxies: PropTypes.array,
};

export default ColorTool;
