import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Img from 'gatsby-image';
import findIndex from 'lodash/findIndex';
import styles from './styles.module.scss';

class Blinker extends React.PureComponent {
  constructor(props) {
    super(props);
    const { activeId: activeIdProp, images } = props;
    const firstName = this.getNameFromImage(images[0]);
    const activeId = activeIdProp || firstName;
    const activeIndex = this.getActiveIndex(images, activeId);
    this.state = {
      activeId: activeId || firstName,
      activeIndex: activeIndex || 0,
    };

    this.autoInterval = null;
  }

  componentDidMount() {
    const { images } = this.props;

    this.autoNext(images);
  }

  componentDidUpdate() {
    // const { activeIndex, activeId } = this.state;
  }

  componentWillUnmount() {
    clearInterval(this.autoInterval);
  }

  nextActive(images) {
    const { activeIndex: currentIndex } = this.state;
    const nextIndex = currentIndex + 1;
    const activeIndex = nextIndex < images.length ? nextIndex : 0;
    const activeId = this.getNameFromImage(images[activeIndex]);
    this.setState(prevState => ({
      ...prevState,
      activeId,
      activeIndex,
    }));
  }

  previousActive(images) {
    const { activeIndex: currentIndex } = this.state;
    const nextIndex = currentIndex + 1;
    const activeIndex = nextIndex < 0 ? nextIndex : images.length - 1;
    const activeId = this.getNameFromImage(images[activeIndex]);
    this.setState(prevState => ({
      ...prevState,
      activeId,
      activeIndex,
    }));
  }

  getActiveIndex(images, activeId) {
    return findIndex(images, image => {
      return this.getNameFromImage(image) === activeId;
    });
  }

  parseName(originalName) {
    return originalName.split('_sci.')[0];
  }

  getNameFromImage(image) {
    const fluid = this.getFluid(image);
    const { originalName } = fluid;
    return this.parseName(originalName);
  }

  getFluid(image) {
    const {
      childImageSharp: { fluid },
    } = image;
    return fluid;
  }

  autoNext = () => {
    const { images } = this.props;

    this.autoInterval = setInterval(() => {
      this.nextActive(images);
    }, 200);
  };

  render() {
    const { images } = this.props;
    const { activeId } = this.state;
    return (
      <div className={styles.blinkContainer}>
        {images.map(image => {
          const fluid = this.getFluid(image);
          const id = this.getNameFromImage(image);
          const imageClasses = classnames(styles.blinkerImage, {
            [styles.active]: activeId === id,
          });

          return (
            <div key={id} className={styles.blinkImageContainer}>
              <Img
                className={imageClasses}
                alt={`Cutout image for alert ${id}`}
                fluid={fluid}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

Blinker.propTypes = {
  images: PropTypes.array,
  activeId: PropTypes.string,
  // selected: PropTypes.bool,
  // x: PropTypes.number,
  // y: PropTypes.number,
  // classes: PropTypes.string,
};

export default Blinker;
