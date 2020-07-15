import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Slider from '../../site/slider/index.js';
import SelectField from '../../site/selectField/index.js';
import Button from '../../site/button/index.js';
import ArrowDown from '../../site/icons/ArrowDown';

import {
  filter,
  filterActive,
  selectContainer,
  button,
  active,
  col50,
  imagesContainer,
  buttonContainer,
  container,
} from './color-tool.module.scss';

class ColorTool extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      filters: [],
      colorOptions: [],
    };
  }

  componentDidMount() {
    const { filters, colorOptions } = this.props;

    this.setState(prevState => ({
      ...prevState,
      filters,
      colorOptions,
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

  render() {
    const { filters, colorOptions } = this.state;
    return (
      <div className={`container-flex ${container}`}>
        <div className={`${buttonContainer} ${col50}`}>
          {filters &&
            filters.map((btn, i) => {
              const key = `div-${i}`;
              const btnClassName = classnames(button, { [active]: btn.active });
              return (
                <div key={key} className={selectContainer}>
                  <Button
                    floating
                    className={btnClassName}
                    onClick={() => this.handleImage(btn)}
                  >
                    {btn.label}
                  </Button>
                  <SelectField
                    dropdownIcon={<ArrowDown />}
                    id={btn.label}
                    placeholder="None"
                    menuItems={colorOptions}
                    onChange={this.handleColorChange}
                  />
                  <Slider
                    id={btn.label}
                    onChange={value => this.handleBrightness(value, btn.label)}
                  />
                </div>
              );
            })}
        </div>
        <div className={`${imagesContainer} ${col50}`}>
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
    );
  }
}

ColorTool.propTypes = {
  filters: PropTypes.array,
  colorOptions: PropTypes.array,
};

export default ColorTool;
