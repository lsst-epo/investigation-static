import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Select from '../../site/selectField/index.jsx';
import ArrowDown from '../../site/icons/ArrowDown';

import styles from './prism-widget.module.scss';
import prismHexColors from '../../../assets/stylesheets/_variables.scss';

class PrismWidget extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedColor: 'None',
    };

    this.prismColors = {
      Red: prismHexColors.red,
      Orange: prismHexColors.orange,
      Yellow: prismHexColors.yellow,
      Green: prismHexColors.green,
      Blue: prismHexColors.blue,
      Violet: prismHexColors.violet,
      None: 'transparent',
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

  hideArrow(color) {
    const { selectedColor } = this.props;
    return selectedColor !== color && selectedColor !== 'None';
  }

  render() {
    const { qaReview } = this.props;
    const { selectedColor } = this.state;

    return (
      <>
        <h2>Filter Tool</h2>
        <div className={styles.contentWrapper}>
          <svg
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 1551.6 736.7"
          >
            <defs>
              <linearGradient id="no-arrow-red">
                <stop offset="0%" stopColor={this.prismColors.Red} />
                <stop offset="81%" stopColor={this.prismColors.Red} />
                <stop offset="81%" stopColor="transparent" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="no-arrow-orange">
                <stop offset="0%" stopColor={this.prismColors.Orange} />
                <stop offset="80%" stopColor={this.prismColors.Orange} />
                <stop offset="80%" stopColor="transparent" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="no-arrow-yellow">
                <stop offset="0%" stopColor={this.prismColors.Yellow} />
                <stop offset="79%" stopColor={this.prismColors.Yellow} />
                <stop offset="79%" stopColor="transparent" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="no-arrow-green">
                <stop offset="0%" stopColor={this.prismColors.Green} />
                <stop offset="78%" stopColor={this.prismColors.Green} />
                <stop offset="78%" stopColor="transparent" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="no-arrow-blue">
                <stop offset="0%" stopColor={this.prismColors.Blue} />
                <stop offset="77%" stopColor={this.prismColors.Blue} />
                <stop offset="77%" stopColor="transparent" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="no-arrow-violet">
                <stop offset="0%" stopColor={this.prismColors.Violet} />
                <stop offset="77%" stopColor={this.prismColors.Violet} />
                <stop offset="77%" stopColor="transparent" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <radialGradient
              id="gradient_1_"
              cx="718.4264"
              cy="-294.6529"
              r="417.8"
              fx="638.9412"
              fy="-303.5418"
              gradientTransform="matrix(1 0 0 1 0 534)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.12" style={{ stopColor: '#FFFFFF' }} />
              <stop offset="1" style={{ stopColor: '#000000' }} />
            </radialGradient>
            <polygon
              id="gradient"
              points="653.2,127 867.4,498 438.9,498"
              fill="url(#gradient_1_)"
              style={{ opacity: 0.3 }}
            />
            <text transform="matrix(1 0 0 1 1206.5464 164.1372)" fill="#ffffff">
              Filter
            </text>
            <line
              id="white_ray"
              className={styles.whiteLine}
              x1="108.2"
              y1="463.3"
              x2="546.1"
              y2="312.5"
            />
            <line
              id="white_light_arrow_line"
              className={styles.whiteLine}
              x1="376.8"
              y1="327.9"
              x2="430"
              y2="309.6"
            />
            <polygon
              id="white_light_arrow"
              points="420.7,325.4 428.1,310.3 413,302.9 422.5,299.7 437.6,307 430.2,322.1"
              fill="#ffffff"
            />
            <text
              transform="matrix(0.9446 -0.3282 0.3282 0.9446 152.0965 417.697)"
              fill="#ffffff"
            >
              White light
            </text>
            <text transform="matrix(1 0 0 1 598.2964 606.0872)" fill="#ffffff">
              Prism
            </text>
            <g id="rays_out">
              <path
                id="violet_ray"
                className={classnames(styles.rayViolet, {
                  [styles.noArrow]: this.hideArrow('Violet'),
                })}
                d="M546.1,312.5l212.8,1.9h0.4l0.5,0.2L1396,522.8c6.9,2.3,10.7,9.7,8.5,16.7s-9.7,10.7-16.7,8.5l0,0l-0.4-0.1L757.8,320.4l0.9,0.2L546.1,312.5z"
              />
              <polygon
                id="violet_arrow"
                className={styles.arrowViolet}
                points="1426.5,547.9 1353.2,550.6 1377.9,530.1 1372.3,498.5"
              />
              <path
                id="blue_ray"
                className={classnames(styles.rayBlue, {
                  [styles.noArrow]: this.hideArrow('Blue'),
                })}
                d="M546.1,312.4l206.5-4.4h0.4l0.4,0.1l641.1,164c7,1.8,11.2,8.9,9.4,15.9c-1.8,7-8.9,11.2-15.9,9.4l-0.4-0.1L751.8,313.8l0.8,0.1L546.1,312.4z"
              />
              <polygon
                id="blue_arrow"
                className={styles.arrowBlue}
                points="1431.5,496.4 1358.6,504.1 1381.8,482 1374.1,450.9"
              />
              <path
                id="green_ray"
                className={classnames(styles.rayGreen, {
                  [styles.noArrow]: this.hideArrow('Green'),
                })}
                d="M547.8,312l200.6-10.6h0.3l0.4,0.1l644.8,120.3c7,1.4,11.5,8.2,10.1,15.2c-1.4,6.9-8,11.4-14.9,10.2l-0.4-0.1L747.8,307.4l0.7,0.1L547.8,312z"
              />
              <polygon
                id="green_arrow"
                className={styles.arrowGreen}
                points="1437.9,443.4 1366.1,458.4 1387,434.1 1376.2,403.9"
              />
              <path
                id="yellow_ray"
                className={classnames(styles.rayYellow, {
                  [styles.noArrow]: this.hideArrow('Yellow'),
                })}
                d="M546.1,312.5l205.8-17.3h0.3h0.4l640.4,75.3c7.1,0.8,12.2,7.2,11.3,14.3c-0.8,7.1-7.2,12.2-14.3,11.3l-0.4-0.1l-637.9-94.5h0.6L546.1,312.5z"
              />
              <polygon
                id="yellow_arrow"
                className={styles.arrowYellow}
                points="1438.9,389.7 1368,408.2 1387.6,382.8 1375.4,353.3"
              />
              <path
                id="orange_ray"
                className={classnames(styles.rayOrange, {
                  [styles.noArrow]: this.hideArrow('Orange'),
                })}
                d="M546.1,311l189.3-21.8h0.2h0.3l656.5,33.3c7,0.4,12.4,6.3,12,13.3s-6.3,12.4-13.3,12h-0.4l-655.2-52.9h0.5L546.1,311z"
              />
              <polygon
                id="orange_arrow"
                className={styles.arrowOrange}
                points="1443.7,340.3 1373.9,362.8 1392.1,336.4 1378.2,307.5"
              />
              <path
                id="red_ray"
                className={classnames(styles.rayRed, {
                  [styles.noArrow]: this.hideArrow('Red'),
                })}
                d="M546.1,311L730,283.9h0.1h0.2l661.4-9.9c6.9-0.1,12.6,5.4,12.7,12.3s-5.4,12.6-12.3,12.7h-0.4l-661.4-9.8h0.4L546.1,311z"
              />
              <polygon
                id="red_arrow"
                className={styles.arrowRed}
                points="1441.9,290 1372.4,313.2 1390.3,286.6 1376.1,257.9"
              />
            </g>
            <line
              id="filter"
              className={styles.filter}
              x1="1255.6"
              y1="235.7"
              x2="1193.1"
              y2="550.3"
              stroke={this.prismColors[selectedColor]}
              fill="#ffffff"
            />
            <polygon
              id="outline"
              className={styles.prismOutline}
              points="653.2,127 760.3,312.5 867.4,498 653.2,498 438.9,498 546.1,312.5 "
            />
          </svg>
          <div className={styles.selectContainer}>
            <p className={styles.selectLabel}>Select a filter:</p>
            <Select
              dropdownIcon={<ArrowDown />}
              id="color-select"
              className="set-white-color"
              menuItems={Object.keys(this.prismColors)}
              onChange={this.handleSelect}
              value={selectedColor}
              block
              position="top left"
              fullWidth
              disabled={qaReview}
              simplifiedMenu={false}
              listStyle={{
                left: 0,
                top: '100%',
                width: '100%',
              }}
            />
          </div>
        </div>
      </>
    );
  }
}

PrismWidget.propTypes = {
  selectionCallback: PropTypes.func,
  selectedColor: PropTypes.string,
  qaReview: PropTypes.bool,
};

export default PrismWidget;
