import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import BlinkerImage from './BlinkerImage';
import {
  blinkContainer,
  loadingContainer,
  loadingImages,
} from './blinker.module.scss';

class BlinkerImages extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imagesLoaded: 0,
      loading: true,
    };
  }

  loadCallback = () => {
    const { images } = this.props;
    this.setState(prevState => {
      const { imagesLoaded: prevImagesLoaded } = prevState;

      const imagesLoaded = prevImagesLoaded + 1;

      return {
        ...prevState,
        imagesLoaded,
        loading: imagesLoaded !== images.length,
      };
    });
  };

  render() {
    const { images, activeId } = this.props;
    const { loading } = this.state;
    const loadingClass = classnames(loadingContainer, {
      [loadingImages]: loading,
    });

    return (
      <>
        <div className={blinkContainer} data-testid="blinker-images">
          {loading && (
            <CircularProgress
              id="img-loader"
              className="chart-loader"
              scale={3}
            />
          )}
          <div className={loadingClass}>
            {images.map((image, i) => {
              const { id, name } = image;
              let active = activeId === id;
              if (!activeId && i === 0) active = true;

              return (
                <BlinkerImage
                  loading={loading}
                  key={id}
                  image={name}
                  alertId={id}
                  active={active}
                  loadCallback={this.loadCallback}
                />
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

BlinkerImages.propTypes = {
  images: PropTypes.array.isRequired,
  activeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default BlinkerImages;
