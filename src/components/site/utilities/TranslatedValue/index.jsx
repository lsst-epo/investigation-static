import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { isArray } from 'lodash';
import { getValue, addTheCommas, formatValue } from '../../../../lib/utilities';

const TranslatedValue = ({ accessor, data }) => {
  const { t } = useTranslation();

  const getCountOutOfTotal = () => {
    if (!isArray(data)) return null;
    const [count, total] = data;
    const formattedCount = addTheCommas(formatValue(count));
    const formattedTotal = addTheCommas(formatValue(total));

    return t('interface::utilities.count_of_total', {
      count: formattedCount,
      total: formattedTotal,
    });
  };

  return (
    <>
      {{ countOfTotal: getCountOutOfTotal() }[accessor] ||
        t(getValue(accessor, data))}
    </>
  );
};

TranslatedValue.propTypes = {
  accessor: PropTypes.string,
  data: PropTypes.any,
};

export default TranslatedValue;
