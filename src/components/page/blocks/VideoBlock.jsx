import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import { Trans, withTranslation } from 'gatsby-plugin-react-i18next';

import {
  gridVideo,
  gridVideoPlayerWrapper,
  gridVideoReactPlayer,
  gridVideoTop,
  gridVideoMiddle,
  gridVideoBottom,
} from '../page.module.scss';

class VideoBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.gridClasses = {
      top: gridVideoTop,
      middle: gridVideoMiddle,
      bottom: gridVideoBottom,
    };

    this.state = {
      errorOnLoad: null,
    };
  }

  handleOnError = e => {
    const { target } = e || {};
    const { error, currentSrc } = target || {};

    if (error) {
      const { code, message } = e.target.error;

      // eslint-disable-next-line no-console
      console.error({ code, message, currentSrc, e });

      this.setState(prevState => ({
        ...prevState,
        errorOnLoad: true,
      }));
    }
  };

  setUserDefinedAspectRatio = () => {
    const { block: video } = this.props;
    const {
      options: { width, height },
    } = video;
    if (width && height) {
      return {
        paddingTop: `${100 / (width / height)}%`,
      };
    }
    return {};
  };

  render() {
    const { block, row, t } = this.props;
    const { errorOnLoad } = this.state;
    const { mediaPath, figText, altText, options } = block;
    const { showControls, volume, autoPlay, loop } = options || {};
    const config = {
      file: {
        attributes: {
          alt: t(altText),
        },
      },
    };

    return !errorOnLoad ? (
      <figure className={`${gridVideo} ${this.gridClasses[row]}`}>
        <div
          className={gridVideoPlayerWrapper}
          style={this.setUserDefinedAspectRatio()}
        >
          <ReactPlayer
            className={gridVideoReactPlayer}
            config={config}
            url={`/videos/${mediaPath}`}
            width="100%"
            height="100%"
            controls={showControls}
            playing={autoPlay}
            volume={+volume}
            muted={autoPlay}
            loop={loop}
            onError={this.handleOnError}
          />
        </div>
        {figText && (
          <figcaption>
            <Trans>{figText}</Trans>
          </figcaption>
        )}
      </figure>
    ) : (
      <div>
        <h3>
          <Trans>interface::errors.loading.video</Trans>
        </h3>
      </div>
    );
  }
}

VideoBlock.defaultProps = {
  block: {
    options: {
      autoPlay: true,
      volume: 0.8,
      showControls: true,
      loop: false,
    },
  },
};

VideoBlock.propTypes = {
  block: PropTypes.object,
  row: PropTypes.string,
  t: PropTypes.func,
};

export default withTranslation()(VideoBlock);
