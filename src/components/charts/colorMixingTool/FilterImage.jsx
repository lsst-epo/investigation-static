import React from 'react';
import PropTypes from 'prop-types';

class FilterImage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
    this.background = new Image();
  }

  componentDidMount() {
    const { image, color, height, width } = this.props;
    this.updateCanvas(image, color, width, height);
  }

  componentDidUpdate(prevProps) {
    const { image, color, height, width } = this.props;
    const { color: prevColor, image: prevImage } = prevProps;

    if (color !== prevColor || image !== prevImage) {
      this.updateCanvas(image, color, width, height);
    }
  }

  updateColor(ctx, color, width, height) {
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fillStyle = color || 'transparent';
    ctx.fill();
  }

  updateCanvas(image, color, width, height) {
    const imgPath = image ? `/images/colorTool/${image}` : '';
    const ctx = this.canvasRef.current.getContext('2d');

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'multiply';

    this.background.onload = () => {
      ctx.drawImage(this.background, 0, 0, width, height);
      this.updateColor(ctx, color, height, width);
    };

    this.background.src = imgPath;
  }

  render() {
    const { className, width, height, brightness } = this.props;
    console.log(brightness, className);

    return (
      <canvas
        className={className}
        ref={this.canvasRef}
        width={width}
        height={height}
        style={{ filter: `brightness(${brightness}) contrast(1.3)` }}
      />
    );
  }
}

FilterImage.defaultProps = {
  height: 600,
  width: 600,
};

FilterImage.propTypes = {
  className: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  image: PropTypes.string,
  color: PropTypes.string,
  brightness: PropTypes.number,
};

export default FilterImage;
