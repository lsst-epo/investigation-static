/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import Switch from '../components/site/switch';

const LanguageToggleContainer = () => {
  const { t } = useTranslation('interface');
  const { useState, useEffect, useRef } = React;
  const {
    language: currentLanguage,
    defaultLanguage,
    changeLanguage,
  } = useI18next();
  const [toEs, setToEs] = useState(currentLanguage !== defaultLanguage);
  const switchCount = useRef(0);
  const id = 'langSelect';

  useEffect(() => {
    // don't run effect for change to `toEs` on mount
    if (switchCount.current > 0) {
      const newLang = toEs ? 'es' : 'en';
      changeLanguage(newLang);
    }

    switchCount.current += 1;
  }, [toEs]);

  const handleClick = () => {
    setToEs(prevValue => !prevValue);
  };

  return (
    <fieldset className="language-toggle-container">
      <legend className="hidden">{t('language_toggle.legend')}</legend>
      <label htmlFor={id}>
        <span role="presentation" className="language-toggle-label">
          {t('language_toggle.label')}
        </span>
        <span className="hidden">{t('language_toggle.espanol_site_name')}</span>
      </label>

      <Switch
        leftLabel="EN"
        rightLabel="ES"
        checked={toEs}
        onClick={handleClick}
        id={id}
      />
    </fieldset>
  );
};

export default LanguageToggleContainer;
