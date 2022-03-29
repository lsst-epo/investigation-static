import React from 'reactn';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import { I18nextContext } from 'gatsby-plugin-react-i18next';
import { LANGUAGE_KEY } from 'gatsby-plugin-react-i18next/dist/types';

const Link = React.forwardRef(({ language, to, onClick, ...rest }, ref) => {
  const context = React.useContext(I18nextContext);
  const urlLanguage = language || context.language;
  const getLanguagePath = selectedLanguage => {
    return context.generateDefaultLanguagePage ||
      selectedLanguage !== context.defaultLanguage
      ? `/${selectedLanguage}`
      : '';
  };
  const link = `${getLanguagePath(urlLanguage)}${to}`;

  return (
    <GatsbyLink
      {...rest}
      hrefLang={urlLanguage}
      innerRef={ref}
      to={link}
      onClick={e => {
        if (language) {
          localStorage.setItem(LANGUAGE_KEY, language);
        }
        if (onClick) {
          onClick(e);
        }
      }}
    />
  );
});

Link.propTypes = {
  language: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default Link;
