import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { SVGIcon, SelectField } from 'react-md';
import Button from '../../site/button/index.js';
// import arrowDropDown from 'icons/arrow_drop_down.svg';

import {
  greenFilter,
  redFilter,
  blueFilter,
  selectContainer,
  button,
  active,
  col50,
  imagesContainer,
  buttonContainer,
  container,
} from './color-tool.module.scss';

class ColorTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      greenIsActive: false,
      redIsActive: false,
      blueIsActive: false,
      greenSelector: false,
      redSelector: false,
      blueSelector: false,
    };
  }

  handleImage(btnObj) {
    const { color } = btnObj;
    const stateName = color + 'IsActive';
    this.setState(prevState => ({
      ...prevState,
      [stateName]: !prevState[stateName],
    }));
  }

  handleColorChange = value => {
    const stateName = value + 'Selector';
    console.log(value);

    this.setState(prevState => ({
      ...prevState,
      [stateName]: true,
    }));
  };

  getStyles(color) {
    const { greenSelector, redSelector, blueSelector } = this.state;
    const activeColors = {
      green: greenSelector,
      red: redSelector,
      blue: blueSelector,
    };

    console.log(activeColors[color]);

    if (activeColors[color]) {
      return { backgroundColor: color };
    }
    return {};
  }

  render() {
    const { data } = this.props;
    const { greenIsActive, redIsActive, blueIsActive } = this.state;

    const activeFilters = {
      green: greenIsActive,
      red: redIsActive,
      blue: blueIsActive,
    };

    const redStyle = this.getStyles('red');
    const blueStyle = this.getStyles('blue');
    const greenStyle = this.getStyles('green');
    // const icon = <SVGIcon use={arrowDropDown.url} />;

    return (
      <div className={`container-flex ${container}`}>
        <div className={`${buttonContainer} ${col50}`}>
          {data &&
            data.map((btn, i) => {
              const key = `div-${i}`;
              const btnKey = `button-${i}-${btn.color}`;
              const selectKey = `select-${i}`;
              const isActive = activeFilters[btn.color];
              const btnClassname = classnames(button, { [active]: isActive });
              const STRING_ITEMS = ['red', 'blue', 'green', 'none'];

              return (
                <div key={key} className={selectContainer}>
                  <Button
                    key={btnKey}
                    floating
                    className={btnClassname}
                    onClick={() => this.handleImage(btn)}
                  >
                    {btn.label}
                  </Button>
                  <SelectField
                    key={selectKey}
                    id="select-field"
                    placeholder="None"
                    menuItems={STRING_ITEMS}
                    onChange={this.handleColorChange}
                  />
                </div>
              );
            })}
        </div>
        <div className={`${imagesContainer} ${col50}`}></div>
        {redIsActive && <div style={redStyle} className={redFilter}></div>}
        {blueIsActive && <div style={blueStyle} className={blueFilter}></div>}
        {greenIsActive && (
          <div style={greenStyle} className={greenFilter}></div>
        )}
      </div>
    );
  }
}

ColorTool.propTypes = {
  data: PropTypes.array,
};

export default ColorTool;
