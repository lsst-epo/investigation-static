import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { earlyAccess } from './early-access.module.scss';
import Flag from '../..';

function EarlyAccess({ className }) {
  const { t } = useTranslation();

  return (
    <Flag className={classnames(className, earlyAccess)} color="#f80">
      {t('early_access')}
    </Flag>
  );
}

EarlyAccess.propTypes = {
  className: PropTypes.string,
};

export default EarlyAccess;
