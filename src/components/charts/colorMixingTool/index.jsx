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
  imageContainer,
  toolActionsHeader,
  buttonToolContainer,
  selectToolContainer,
  sliderToolContainer,
} from './color-tool.module.scss';

class ColorTool extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      colorOptions: [],
      hexColors: [],
      resetBtnActive: false,
      galaxyImg: null,
      selectorVal: null,
    };
  }

  componentDidMount() {
    const {
      data,
      colorOptions,
      hexColors,
      galaxyImg,
      selectorVal,
    } = this.props;

    let isActive = false;

    Object.keys(data).forEach(index => {
      if (data[index].active) {
        isActive = data[index].filters.filter(filterObj => {
          return filterObj.active;
        });
      }
    });

    this.setState(prevState => ({
      ...prevState,
      colorOptions,
      hexColors,
      resetBtnActive: isActive.length > 0,
      galaxyImg,
      selectorVal,
      data,
    }));

    if (galaxyImg !== null && selectorVal !== 'color') {
      this.handleGalaxySelection(galaxyImg, data);
      this.setState(prevState => ({
        ...prevState,
        selectorVal: galaxyImg,
      }));
    }
  }

  handleImage(btnObj) {
    const { data: oldData, selectorVal: oldSelectorVal } = this.state;
    const { active: oldActive } = btnObj;
    const updatedFilters = oldData[oldSelectorVal].filters.map(newFilter => {
      if (newFilter.label === btnObj.label) {
        newFilter.active = !oldActive;
      }
      return newFilter;
    });

    this.updateAnswers(updatedFilters);
  }

  handleColorChange = (value, index, event, { id }) => {
    const { data, selectorVal } = this.state;
    const updatedFilters = data[selectorVal].filters.map(newFilter => {
      if (`${newFilter.label}-filter` === id) {
        newFilter.color = value === 'None' ? '' : value;
      }
      return newFilter;
    });

    this.updateAnswers(updatedFilters, {
      resetBtnActive: true,
    });
  };

  handleReset = () => {
    const { data, selectorVal } = this.state;
    const updatedFilters = data[selectorVal].filters.map(newFilter => {
      newFilter.color = '';
      newFilter.active = false;
      newFilter.brightness = 0.7;
      newFilter.value = 0;
      return newFilter;
    });

    this.updateAnswers(updatedFilters, {
      resetBtnActive: false,
    });
  };

  handleBrightness(value, label) {
    const { data: oldData, selectorVal: oldSelectorVal } = this.state;
    const updatedFilters = oldData[oldSelectorVal].filters.map(
      (newFilter, i) => {
        if (newFilter.label === label) {
          newFilter.brightness = this.convertToValue(value, i);
          newFilter.value = value;
        }
        return newFilter;
      }
    );

    this.updateAnswers(updatedFilters);
  }

  handleGalaxySelection = (value, optData) => {
    const { data: oldData, selectorVal: oldSelectorVal } = this.state;
    const { selectionCallback } = this.props;
    const d = typeof optData === 'object' ? optData : oldData;
    const newFilters = d[value].filters.map(newFilter => {
      newFilter.image = `${value.toLowerCase()}-${newFilter.label.toLowerCase()}.png`;
      return newFilter;
    });

    const isActive = d[value].filters.filter(filterObj => {
      return filterObj.active;
    });

    let newData = {
      selectorVal: value,
      resetBtnActive: isActive.length > 0,
      data: {
        ...d,
        [value]: {
          ...d[value],
          active: true,
          filters: newFilters,
        },
      },
    };

    if (oldSelectorVal !== '') {
      newData = {
        ...newData,
        data: {
          ...newData.data,
          [oldSelectorVal]: {
            ...d[oldSelectorVal],
            active: false,
          },
        },
      };
    }

    this.setState(
      prevState => ({
        ...prevState,
        ...newData,
      }),
      () => {
        const { data, selectorVal } = this.state;
        selectionCallback(data, selectorVal);
      }
    );
  };

  updateAnswers = (updatedFilters, props) => {
    const { selectorVal: oldSelectorVal } = this.state;
    const { selectionCallback } = this.props;
    this.setState(
      prevState => ({
        ...prevState,
        ...props,
        data: {
          ...prevState.data,
          [oldSelectorVal]: {
            ...prevState.data[oldSelectorVal],
            filters: updatedFilters,
          },
        },
      }),
      () => {
        const { data, selectorVal } = this.state;
        if (selectionCallback) {
          selectionCallback(data, selectorVal);
        }
      }
    );
  };

  getMenuItems = () => {
    const { data } = this.state;

    if (!data) return [];

    return Object.keys(data);
  };

  getFilters = () => {
    const { data, selectorVal } = this.state;
    if (data && selectorVal && selectorVal !== '') {
      if (data[selectorVal]) {
        return data[selectorVal].filters;
      }
      return [];
    }
    return [];
  };

  getColorBlocks() {
    const { colorOptions } = this.state;
    return colorOptions.map(color => {
      return {
        label: color,
        value: color,
      };
    });
  }

  convertToValue(value, index) {
    const { data, selectorVal } = this.state;
    const galaxy = data[selectorVal].filters[index];
    const s = galaxy.max - galaxy.min;
    const retVal = s * (value / 100) + galaxy.min;
    return retVal;
  }

  convertToPercent(value, index) {
    const { data, selectorVal } = this.state;
    const galaxy = data[selectorVal].filters[index];
    const s = galaxy.max - galaxy.min;
    const retVal = ((value - galaxy.min) / s) * 100;
    return retVal;
  }

  render() {
    const { title } = this.props;
    const { data, resetBtnActive, galaxyImg, selectorVal } = this.state;
    const menuItems = this.getMenuItems();
    const filters = this.getFilters();

    return (
      <>
        {title && <h2>{title}</h2>}
        <div className={`container-flex ${container}`}>
          <div className={`${buttonContainer} ${col50}`}>
            {data && selectorVal !== 'color' && typeof galaxyImg !== 'string' && (
              <div className={container}>
                <Select
                  dropdownIcon={<ArrowDown />}
                  id="galaxy-selector"
                  placeholder="Select A Galaxy"
                  menuItems={menuItems}
                  onChange={this.handleGalaxySelection}
                  value={selectorVal}
                  fullWidth
                />
              </div>
            )}
            {filters && (
              <div className={toolActionsHeader}>
                <div className={buttonToolContainer}>Filter</div>
                <div className={selectToolContainer}>Color</div>
                <div className={sliderToolContainer}>Color Intensity</div>
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
                    <div className={buttonToolContainer}>
                      <Button
                        floating
                        disabled={btn.isDisabled}
                        className={btnClassName}
                        onClick={() => this.handleImage(btn)}
                      >
                        {btn.label}
                      </Button>
                    </div>
                    <div className={selectToolContainer}>
                      <Select
                        dropdownIcon={<ArrowDown />}
                        disabled={btn.isDisabled}
                        id={`${btn.label}-filter`}
                        placeholder="None"
                        value={btn.color}
                        menuItems={this.getColorBlocks()}
                        onChange={this.handleColorChange}
                        fullWidth
                      />
                    </div>
                    <div className={sliderContainer}>
                      <SliderCustom
                        id={btn.label}
                        className={
                          btn.color !== ''
                            ? `fill-color-${btn.color.toLowerCase()}`
                            : ''
                        }
                        min={1}
                        max={100}
                        value={btn.value || 1}
                        disabled={!btn.active}
                        onChange={value =>
                          this.handleBrightness(value, btn.label)
                        }
                      />
                    </div>
                  </div>
                );
              })}
            {selectorVal && (
              <Button
                raised
                primary
                disabled={!resetBtnActive}
                className={resetBtn}
                onClick={this.handleReset}
              >
                Reset
              </Button>
            )}
          </div>
          <div className={`${imageContainer} ${col50}`}>
            {filters &&
              filters.map(filterImage => {
                const imageClassName = classnames(filter, {
                  [filterActive]: filterImage.active,
                });

                return (
                  <div
                    key={`filter-${filterImage.label}`}
                    style={{
                      backgroundImage: `url(/images/${filterImage.image}`,
                      backgroundColor: filterImage.color,
                      filter: `brightness(${filterImage.brightness})`,
                    }}
                    className={imageClassName}
                  ></div>
                );
              })}
          </div>
        </div>
      </>
    );
  }
}

ColorTool.propTypes = {
  colorOptions: PropTypes.array,
  hexColors: PropTypes.array,
  galaxyImg: PropTypes.string,
  selectionCallback: PropTypes.func,
  data: PropTypes.object,
  title: PropTypes.string,
  selectorVal: PropTypes.string,
};

export default ColorTool;
