import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'gatsby-plugin-react-i18next';
import {
  legend,
  neoName,
  details,
  detail,
  title,
  copy,
} from './time-domain-viewer.module.scss';

class Legend extends React.PureComponent {
  render() {
    const { name, activeAlert, selectedData, backgroundColor } = this.props;
    const { start, date } = activeAlert || {};

    return (
      <div className={legend} style={{ backgroundColor }}>
        {name && <div className={neoName}>{name}</div>}
        {activeAlert && selectedData && (
          <ul className={details}>
            <li className={detail}>
              <div className={title}>
                <Trans>widgets::time_viewer.observation_date</Trans>
              </div>
              <div className={copy}>
                {date} {start}
              </div>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

Legend.propTypes = {
  name: PropTypes.string,
  activeAlert: PropTypes.object,
  selectedData: PropTypes.array,
  backgroundColor: PropTypes.string,
};

export default Legend;
