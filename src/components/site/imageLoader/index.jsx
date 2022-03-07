import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import {
  imageLoaded,
  imageNotLoaded,
  loaderImage,
} from './image-loader.module.scss';

class ImageLoader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };

    this.timeFallback = setTimeout(this.handleLoading, 4000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeFallback);
  }

  handleLoading = () => {
    this.setState(() => ({ loaded: true }));
    clearTimeout(this.timeFallback);
  };

  render() {
    const { src, alt, className } = this.props;
    const { loaded } = this.state;
    const classes = classnames(className, loaderImage, {
      [imageLoaded]: loaded,
      [imageNotLoaded]: !loaded,
    });

    return (
      <>
        {!loaded && (
          <CircularProgress
            id="img-loader"
            className="chart-loader"
            scale={3}
          />
        )}
        <img
          className={classes}
          src={src}
          alt={alt}
          onLoad={this.handleLoading}
        />
      </>
    );
  }
}

ImageLoader.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default ImageLoader;
