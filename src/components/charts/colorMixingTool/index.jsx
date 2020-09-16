import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isArray from 'lodash/isArray';
import SliderCustom from '../../site/slider/index.jsx';
import Select from '../../site/selectField/index.jsx';
import Button from '../../site/button/index.js';
import ArrowDown from '../../site/icons/ArrowDown';
import {
  getResetBtnState,
  getDataAndPrepare,
  getDefaultFilterValues,
  getBrightnessValue,
  resetAllFilters,
  setFilterActiveAndLoadImage,
} from './color-tool.utilities.js';

import {
  filterImage,
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

    this.defaultFilterValues = null;

    this.state = {
      data: null,
      selectedData: null,
      resetBtnActive: false,
      selectorVal: null,
      toolIsInteractable: false,
    };
  }

  componentDidMount() {
    const {
      data,
      selectedData,
      selectorVal,
      objectName,
      toolIsInteractable,
    } = this.props;

    this.defaultFilterValues = getDefaultFilterValues(
      selectedData || data,
      objectName || selectorVal
    );

    this.setState(prevState => ({
      ...prevState,
      resetBtnActive: getResetBtnState(selectedData),
      selectorVal,
      data: objectName ? selectedData : data,
      selectedData,
      toolIsInteractable,
    }));
  }

  componentDidUpdate() {
    this.setToolActiveState();
    this.checkClearedAnswer();
  }

  checkClearedAnswer = () => {
    const {
      selectedData,
      selectorVal,
      objectName,
      data,
      hasQuestionId,
    } = this.props;
    if (hasQuestionId) {
      this.setState(prevState => ({
        ...prevState,
        resetBtnActive: getResetBtnState(selectedData),
        selectedData,
        selectorVal,
        data: objectName ? selectedData : data,
      }));
    }
  };

  setToolActiveState = () => {
    const { toolIsInteractable } = this.props;

    this.setState(prevState => ({
      ...prevState,
      toolIsInteractable,
    }));
  };

  handleReset = () => {
    const { selectedData } = this.state;

    this.updateAnswers({
      selectedData: {
        ...selectedData,
        filters: resetAllFilters(selectedData),
      },
      resetBtnActive: false,
    });
  };

  handleImage(btnObj) {
    const { selectedData } = this.state;
    const { label, active: btnActive } = btnObj;

    this.updateAnswers({
      selectedData: {
        ...selectedData,
        filters: setFilterActiveAndLoadImage(selectedData, label, btnActive),
      },
      resetBtnActive: true,
    });
  }

  handleColorChange = (value, index, event, { id }) => {
    const { selectedData } = this.state;
    const updatedFilters = selectedData.filters.map(newFilter => {
      if (`${newFilter.label}-filter` === id) {
        newFilter.color = value;
      }
      return newFilter;
    });

    this.updateAnswers({
      selectedData: {
        ...selectedData,
        filters: updatedFilters,
      },
      resetBtnActive: true,
    });
  };

  handleBrightness(value, label) {
    const { selectedData } = this.state;
    const updatedFilters = selectedData.filters.map(newFilter => {
      if (newFilter.label === label) {
        newFilter.brightness = getBrightnessValue(newFilter, value);
        newFilter.value = value;
      }
      return newFilter;
    });

    this.updateAnswers({
      selectedData: {
        ...selectedData,
        filters: updatedFilters,
      },
    });
  }

  handleGalaxySelection = value => {
    const { data: oldData } = this.state;
    const { selectionCallback } = this.props;

    const newSelectedData = {
      name: value,
      filters: getDataAndPrepare(oldData, value),
    };

    this.setState(
      prevState => ({
        ...prevState,
        selectedData: newSelectedData,
        selectorVal: value,
        resetBtnActive: getResetBtnState(newSelectedData),
      }),
      () => {
        const { selectedData, selectorVal } = this.state;
        selectionCallback(selectedData, selectorVal);
      }
    );
  };

  updateAnswers = props => {
    const { selectionCallback } = this.props;
    this.setState(
      prevState => ({
        ...prevState,
        ...props,
      }),
      () => {
        const { data, selectorVal } = this.state;
        if (selectionCallback) {
          selectionCallback(data, selectorVal);
        }
      }
    );
  };

  render() {
    const { title, objectName, menuItems, colorBlocks } = this.props;
    const {
      data,
      selectedData,
      resetBtnActive,
      galaxyImg,
      selectorVal,
      toolIsInteractable,
    } = this.state;
    const widgetTitle = objectName ? `${title}: ${objectName}` : title;
    const filters = selectedData ? selectedData.filters : [];
    const renderContent =
      isArray(data) && selectorVal !== 'color' && typeof galaxyImg !== 'string';

    return (
      <>
        {title && <h2>{widgetTitle}</h2>}
        <div className={`container-flex ${container}`}>
          <div className={`${buttonContainer} ${col50}`}>
            {renderContent && (
              <div className={container}>
                <Select
                  dropdownIcon={<ArrowDown />}
                  id="galaxy-selector"
                  placeholder="Select An Object"
                  menuItems={menuItems}
                  onChange={this.handleGalaxySelection}
                  value={selectorVal}
                  saveListScrollTop
                  sameWidth
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
                        disabled={!toolIsInteractable || btn.isDisabled}
                        className={btnClassName}
                        onClick={() => this.handleImage(btn)}
                      >
                        {btn.label}
                      </Button>
                    </div>
                    <div className={selectToolContainer}>
                      <Select
                        dropdownIcon={<ArrowDown />}
                        disabled={!toolIsInteractable || btn.isDisabled}
                        id={`${btn.label}-filter`}
                        placeholder="None"
                        value={btn.color}
                        menuItems={colorBlocks}
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
                        disabled={!toolIsInteractable || !btn.active}
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
                disabled={!toolIsInteractable || !resetBtnActive}
                className={resetBtn}
                onClick={this.handleReset}
              >
                Reset
              </Button>
            )}
          </div>
          <div className={`${imageContainer} ${col50}`}>
            {filters &&
              filters.map(filterImg => {
                const { label, image, color, brightness } = filterImg;
                const imageClassName = classnames(filterImage, {
                  [filterActive]: filterImg.active,
                });

                return (
                  <div
                    key={`filter-${label}`}
                    className={imageClassName}
                    style={{
                      backgroundImage: image
                        ? `url(/images/colorTool/${image}`
                        : 'none',
                      backgroundColor: color,
                      filter: `brightness(${brightness})`,
                    }}
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
  selectionCallback: PropTypes.func,
  data: PropTypes.array,
  selectedData: PropTypes.object,
  title: PropTypes.string,
  menuItems: PropTypes.array,
  colorBlocks: PropTypes.array,
  selectorVal: PropTypes.string,
  objectName: PropTypes.string,
  hasQuestionId: PropTypes.bool,
  toolIsInteractable: PropTypes.bool,
};

export default ColorTool;
