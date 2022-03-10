import React from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import svg from './checkpoint.svg';
import { checkpointContainer } from './checkpoint.module.scss';

const Checkpoint = () => {
  const { t } = useTranslation('interface');
  return (
    <div className={checkpointContainer}>
      <img
        className="checkpoint-svg"
        src={svg}
        alt={t('locations.checkpoint')}
      />
    </div>
  );
};

export default Checkpoint;
