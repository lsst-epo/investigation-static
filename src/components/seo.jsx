/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import { useTranslation } from 'react-i18next';
import favicon from '../images/favicon/favicon.ico';
import favicon16 from '../images/favicon/favicon-16x16.png';
import favicon32 from '../images/favicon/favicon-32x32.png';
import appleIcon from '../images/favicon/apple-touch-icon.png';
import safariPinnedTab from '../images/favicon/safari-pinned-tab.svg';

function SEO({ description, meta, title }) {
  const { i18n } = useTranslation();
  const { language: lang } = i18n;
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;
  // eslint-disable-next-line prefer-destructuring
  const PLAUSIBLE_DOMAIN = process.env.GATSBY_PLAUSIBLE_DOMAIN;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    >
      <link rel="icon" type="image/png" sizes="48x48" href={favicon} />
      <link rel="apple-touch-icon" sizes="180x180" href={appleIcon} />
      <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
      <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
      <link rel="mask-icon" href={safariPinnedTab} color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#058BBC" />
      <meta name="theme-color" content="#058BBC" />
      {PLAUSIBLE_DOMAIN && (
        <script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
        ></script>
      )}
    </Helmet>
  );
}

SEO.defaultProps = {
  meta: [],
  title: `Vera C. Rubin Observatory Educational Investigation`,
  description: `Rubin formal education investigation`,
};

SEO.propTypes = {
  description: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};

export default SEO;
