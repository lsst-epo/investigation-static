import React from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import en from './svg/checkpoint-en.svg';
import es from './svg/checkpoint-es.svg';
import { checkpointContainer } from './checkpoint.module.scss';

const Checkpoint = () => {
  const svg = { en, es };
  const { t, i18n } = useTranslation('interface');
  const { language } = i18n;

  return (
    <div className={checkpointContainer}>
      <img src={svg[language] || en} alt={t('locations.checkpoint')} />
    </div>
  );
};

export default Checkpoint;
