import PropTypes from 'prop-types';
import React from 'react';
import CustomIcon from '../icons/CustomIcon';
import LinearProgress from '../linearProgress';
import LinearProgressMarker from '../linearProgress/LinearProgressMarker';

class HeaderProgress extends React.PureComponent {
  render = () => {
    const { checkpoints, pageNumber, totalPages } = this.props;
    return (
      <div className="header-progress-wrapper">
        <LinearProgress
          id="current-page-of-total"
          value={pageNumber ? Math.round((pageNumber / totalPages) * 100) : 0}
        >
          {checkpoints.length > 0 && (
            <div className="header-progress-checkpoints">
              {checkpoints.map(checkpoint => {
                return (
                  <LinearProgressMarker
                    key={checkpoint}
                    completed={pageNumber >= checkpoint}
                    progress={Math.round((checkpoint / totalPages) * 100)}
                  >
                    <CustomIcon name="checkpoint" />
                  </LinearProgressMarker>
                );
              })}
              <LinearProgressMarker
                completed={pageNumber >= totalPages}
                progress={100}
              >
                <CustomIcon name="finish" />
              </LinearProgressMarker>
            </div>
          )}
        </LinearProgress>
      </div>
    );
  };
}

HeaderProgress.propTypes = {
  pageNumber: PropTypes.number,
  totalPages: PropTypes.number,
  checkpoints: PropTypes.array,
};

export default HeaderProgress;
