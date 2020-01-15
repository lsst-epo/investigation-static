import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';

class Trendline extends React.PureComponent {
  constructor(props) {
    super(props);

    this.background = React.createRef();

    this.state = {
      peakMagX: null,
      peakMagY: null,
      peakSelected: false,
    };
  }

  componentDidMount() {
    this.handleEventListeners();
  }

  componentDidUpdate() {
    this.handleEventListeners();
  }

  componentWillUnmount() {
    const $background = d3Select(this.background.current);
    this.removeEventListeners($background);
  }

  addEventListeners($background) {
    const { mouseMoveHandler, clickHandler } = this.props;
    const { peakSelected } = this.state;

    if (!peakSelected) {
      $background.on('mousemove', mouseMoveHandler);
    }

    $background.on('click', () => {
      if (peakSelected) {
        $background.on('mousemove', mouseMoveHandler);
        this.setState(
          prevState => ({
            ...prevState,
            peakSelected: false,
          }),
          clickHandler
        );
      } else {
        $background.on('mousemove', null);
        this.setState(
          prevState => ({
            ...prevState,
            peakSelected: true,
          }),
          clickHandler
        );
      }
    });
  }

  removeEventListeners($background) {
    $background.on('mousemove', null);
    $background.on('click', null);
  }

  handleEventListeners() {
    const { isInteractable } = this.props;
    const $background = d3Select(this.background.current);

    if (isInteractable) {
      this.addEventListeners($background);
    } else this.removeEventListeners($background);
  }

  render() {
    const {
      peakMagX,
      peakMagY,
      captureAreaX,
      captureAreaY,
      captureAreaWidth,
      captureAreaHeight,
    } = this.props;

    return (
      <>
        <g>
          <circle
            cx={peakMagX}
            cy={peakMagY}
            r="6"
            strokeWidth={1}
            stroke="#1d4a79"
            fill="transparent"
          />
          <line
            x1="0"
            x2={captureAreaWidth}
            y1={peakMagY}
            y2={peakMagY}
            strokeWidth={1}
            stroke="#1d4a79"
            strokeDasharray="10"
          />
        </g>
        <rect
          ref={this.background}
          x={captureAreaX}
          y={captureAreaY}
          width={captureAreaWidth}
          height={captureAreaHeight}
          fill="transparent"
        />
      </>
    );
  }
}

Trendline.propTypes = {
  peakMagX: PropTypes.number,
  peakMagY: PropTypes.number,
  captureAreaX: PropTypes.number,
  captureAreaY: PropTypes.number,
  captureAreaWidth: PropTypes.number,
  captureAreaHeight: PropTypes.number,
  isInteractable: PropTypes.bool,
  mouseMoveHandler: PropTypes.func,
  clickHandler: PropTypes.func,
};

export default Trendline;
