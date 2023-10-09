import PropTypes from 'prop-types';
import React from 'react';
import last from 'lodash/last';
import CustomIcon from '../components/site/icons/CustomIcon';
import LinearProgress from '../components/site/linearProgress';
import LinearProgressMarker from '../components/site/linearProgress/LinearProgressMarker';

class HeaderProgressContainer extends React.PureComponent {
  getDisplayValue = (currentPage, totalPages) =>
    currentPage ? Math.round((currentPage / totalPages) * 100) : 0;

  getProgressValue = (currentPage, pages) => {
    console.log({ pages });
    const firstSectionPage = pages[0];
    const lastSectionPage = last(pages);
    const sectionRange = lastSectionPage - firstSectionPage;

    if (currentPage < firstSectionPage) return null;
    if (currentPage >= lastSectionPage) return 100;

    return Math.round(((currentPage - firstSectionPage) / sectionRange) * 100);
  };

  render = () => {
    const { pageNumber, totalPages, sections } = this.props;

    console.log({ sections });

    return (
      <div className="header-progress-wrapper">
        {sections &&
          sections.map(section => {
            const { sectionName, pages = [] } = section;
            const key = `section-${sectionName}`;
            const lastPage = last(pages);

            return (
              <LinearProgress
                key={key}
                value={this.getProgressValue(pageNumber, pages)}
                displayValue={this.getDisplayValue(pageNumber, totalPages)}
                style={{ width: `${(pages.length / totalPages) * 100}%` }}
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

HeaderProgressContainer.propTypes = {
  pageNumber: PropTypes.number,
  totalPages: PropTypes.number,
  sections: PropTypes.array,
};

export default HeaderProgressContainer;
