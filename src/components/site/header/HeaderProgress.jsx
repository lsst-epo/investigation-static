import PropTypes from 'prop-types';
import React from 'react';
import last from 'lodash/last';
import CustomIcon from '../icons/CustomIcon';
import LinearProgress from '../linearProgress';
import LinearProgressMarker from '../linearProgress/LinearProgressMarker';

class HeaderProgress extends React.PureComponent {
  getDisplayValue = (currentPage, totalPages) =>
    currentPage ? Math.round((currentPage / totalPages) * 100) : 0;

  getProgressValue = (currentPage, section) => {
    const firstSectionPage = section[0];
    const lastSectionPage = last(section);
    const sectionRange = lastSectionPage - firstSectionPage;

    if (currentPage < firstSectionPage) return null;
    if (currentPage >= lastSectionPage) return 100;

    return Math.round(((currentPage - firstSectionPage) / sectionRange) * 100);
  };

  render = () => {
    const { pageNumber, totalPages, sections } = this.props;

    return (
      <div className="header-progress-wrapper">
        {sections &&
          sections.map((section, i) => {
            const key = `section-${i}`;
            const lastPage = last(section);

            return (
              <LinearProgress
                key={key}
                value={this.getProgressValue(pageNumber, section)}
                displayValue={this.getDisplayValue(pageNumber, totalPages)}
                style={{ width: `${(section.length / totalPages) * 100}%` }}
              >
                {lastPage !== totalPages && (
                  <LinearProgressMarker
                    filled
                    completed={pageNumber >= lastPage}
                    progress={100}
                    style={{ zIndex: pageNumber === lastPage ? -1 : 1 }}
                  >
                    {pageNumber < lastPage && <CustomIcon name="checkpoint" />}
                  </LinearProgressMarker>
                )}
                {lastPage === totalPages && (
                  <LinearProgressMarker
                    completed={pageNumber >= totalPages}
                    progress={100}
                  >
                    <CustomIcon name="finish" />
                  </LinearProgressMarker>
                )}
              </LinearProgress>
            );
          })}
      </div>
    );
  };
}

HeaderProgress.propTypes = {
  pageNumber: PropTypes.number,
  totalPages: PropTypes.number,
  sections: PropTypes.array,
};

export default HeaderProgress;
