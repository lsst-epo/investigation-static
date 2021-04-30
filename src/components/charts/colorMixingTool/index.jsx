import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isArray from 'lodash/isArray';
import filter from 'lodash/filter';
import SliderCustom from '../../site/slider/index.jsx';
import Select from '../../site/selectField/index.jsx';
import Button from '../../site/button/index.js';
import ArrowDown from '../../site/icons/ArrowDown';
import FilterImage from './FilterImage';
import {
  getResetBtnState,
  getDataAndPrepare,
  updateFiltersBrightness,
  resetAllFilters,
  setFilterActiveAndLoadImage,
  getColorNameFromHex,
  getCategoryName,
  updateFiltersColors,
} from './color-tool.utilities.js';

import {
  filterImage,
  filterActive,
  selectContainer,
  button,
  active,
  colFullWidth,
  subHead,
  subHeadTitle,
  controlsContainer,
  sliderContainer,
  colorToolSelect,
  container,
  resetBtn,
  imageContainer,
  toolActionsHeader,
  buttonToolContainer,
  selectToolContainer,
  sliderToolContainer,
  colorSwatchContainer,
} from './color-tool.module.scss';

class ColorTool extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      selectedData: null,
      resetBtnActive: false,
      selectorValue: null,
    };
  }

  componentDidMount() {
    const { data, selectedData, selectorValue, objectName } = this.props;

    this.setState(prevState => ({
      ...prevState,
      resetBtnActive: getResetBtnState(selectedData),
      selectorValue,
      data: objectName ? selectedData : data,
      selectedData: getDataAndPrepare(selectedData, null),
    }));
  }

  componentDidUpdate() {
    this.checkClearedAnswer();
  }

  checkClearedAnswer = () => {
    const {
      selectedData,
      selectorValue,
      objectName,
      data,
      hasQuestionId,
    } = this.props;
    if (hasQuestionId) {
      this.setState(prevState => ({
        ...prevState,
        resetBtnActive: getResetBtnState(selectedData),
        selectedData,
        selectorValue,
        data: objectName ? selectedData : data,
      }));
    }
  };

  handleReset = () => {
    const { selectedData } = this.state;
    const updatedFilters = resetAllFilters(selectedData);

    this.updateAnswers({
      selectedData: {
        ...selectedData,
        filters: updatedFilters,
      },
      resetBtnActive: false,
    });
  };

  handleImage(btnObj) {
    const { selectedData } = this.state;
    const { label, active: btnActive } = btnObj;
    const updatedFilters = setFilterActiveAndLoadImage(
      selectedData,
      label,
      btnActive
    );

    this.updateAnswers({
      selectedData: {
        ...selectedData,
        filters: updatedFilters,
      },
      resetBtnActive: true,
    });
  }

  handleColorChange = (value, index, event, { id }) => {
    const { selectedData } = this.state;
    const updatedFilters = updateFiltersColors(selectedData, id, value);

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
    const updatedFilters = updateFiltersBrightness(selectedData, label, value);

    this.updateAnswers({
      selectedData: {
        ...selectedData,
        filters: updatedFilters,
      },
    });
  }

  handleGalaxySelection = value => {
    const { data } = this.state;

    const newSelectedData = {
      name: value,
      filters: getDataAndPrepare(data, value),
    };

    const newStateObject = {
      selectedData: newSelectedData,
      selectorValue: value,
      resetBtnActive: getResetBtnState(newSelectedData),
    };

    this.updateAnswers(newStateObject);
  };

  updateAnswers = newState => {
    const { selectionCallback } = this.props;
    this.setState(
      prevState => ({
        ...prevState,
        ...newState,
      }),
      () => {
        const { data, selectedData, selectorValue } = this.state;
        if (selectionCallback) {
          const activeFilters = filter(selectedData.filters, {
            active: true,
          });

          if (data || activeFilters > 0) {
            selectionCallback(selectedData, selectorValue);
          }
        }
      }
    );
  };

  render() {
    const {
      title,
      objectName,
      menuItems,
      colorBlocks,
      hexColors,
      colorOptions,
      toolIsInteractable,
      hideControls,
      hideImage,
      hideSubHeadTitle,
      qaReview,
    } = this.props;
    const { data, selectedData, resetBtnActive, selectorValue } = this.state;
    const filters = selectedData ? selectedData.filters : [];
    const controlsContainerClasses = classnames(container, controlsContainer);
    const imageContainerClasses = classnames(imageContainer, {
      [colFullWidth]: hideControls && !hideImage,
    });
    const selectedObjectName = objectName || selectorValue;
    const selectedCategoryName = getCategoryName(data, selectedObjectName);

    return (
      <>
        {title && <h2>{title}</h2>}
        {selectedObjectName && (hideControls || !isArray(data)) && (
          <>
            {isArray(data) && (
              <h4 className={subHead}>
                <span>
                  <span className={subHeadTitle}>Object Type:</span>&nbsp;
                  {selectedCategoryName}
                </span>
                {!hideSubHeadTitle && (
                  <>
                    <br />
                    <span>
                      <span className={subHeadTitle}>Selected Object:</span>
                      &nbsp;
                      {selectedObjectName}
                    </span>
                  </>
                )}
              </h4>
            )}
            {!isArray(data) && !hideSubHeadTitle && (
              <h4 className={subHead}>
                <span className={subHeadTitle}>Object:</span>&nbsp;
                {selectedObjectName}
              </h4>
            )}
          </>
        )}
        <div className={container}>
          {!hideControls && (
            <div className={controlsContainerClasses}>
              {isArray(data) && (
                <div className={`${container} ${selectToolContainer}`}>
                  <Select
                    className={colorToolSelect}
                    dropdownIcon={<ArrowDown />}
                    id="galaxy-selector"
                    placeholder="Select An Object"
                    menuItems={menuItems}
                    onChange={this.handleGalaxySelection}
                    value={selectorValue}
                    saveListScrollTop
                    fullWidth
                    disabled={qaReview}
                    listStyle={{ width: '100%' }}
                    // position="below"
                  />
                </div>
              )}
              {filters && (
                <div className={toolActionsHeader}>
                  <div className={buttonToolContainer}>Filter</div>
                  <div className={colorSwatchContainer}></div>
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
                          className={colorToolSelect}
                          dropdownIcon={<ArrowDown />}
                          disabled={!toolIsInteractable || btn.isDisabled}
                          id={`${btn.label}-filter`}
                          placeholder="Select a filter"
                          value={btn.color}
                          menuItems={colorBlocks}
                          onChange={this.handleColorChange}
                          position="top left"
                          fullWidth
                          simplifiedMenu={false}
                          listStyle={{
                            left: '50%',
                            top: '-50%',
                            width: '100%',
                            minWidth: '150px',
                            transform: 'translateY(-30%)',
                          }}
                        />
                      </div>
                      <div className={sliderContainer}>
                        <SliderCustom
                          id={btn.label}
                          className={getColorNameFromHex(
                            btn.color,
                            hexColors,
                            colorOptions
                          )}
                          min={1}
                          max={100}
                          value={btn.value || 1}
                          disabled={!toolIsInteractable || !btn.active}
                          onChange={value =>
                            this.handleBrightness(value, btn.label)
                          }
                          discrete
                        />
                      </div>
                    </div>
                  );
                })}
              {selectorValue && (
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
          )}
          {!hideImage && (
            <div className={imageContainerClasses}>
              {filters &&
                filters.map(filterImg => {
                  const { label, image, color, brightness } = filterImg;
                  const imageClassName = classnames(filterImage, {
                    [filterActive]: filterImg.active,
                  });

                  return (
                    <FilterImage
                      key={`filter-${label}`}
                      className={imageClassName}
                      {...{
                        image,
                        color,
                        brightness,
                      }}
                    />
                  );
                })}
            </div>
          )}
        </div>
      </>
    );
  }
}

ColorTool.defaultProps = {
  toolIsInteractable: true,
  hideControls: false,
  hideImage: false,
  hideSubHeadTitle: false,
};

ColorTool.propTypes = {
  selectionCallback: PropTypes.func,
  data: PropTypes.array,
  selectedData: PropTypes.object,
  title: PropTypes.string,
  menuItems: PropTypes.array,
  colorBlocks: PropTypes.array,
  hexColors: PropTypes.array,
  colorOptions: PropTypes.array,
  selectorValue: PropTypes.string,
  objectName: PropTypes.string,
  hasQuestionId: PropTypes.bool,
  toolIsInteractable: PropTypes.bool,
  hideControls: PropTypes.bool,
  hideImage: PropTypes.bool,
  hideSubHeadTitle: PropTypes.bool,
  qaReview: PropTypes.bool,
};

export default ColorTool;
