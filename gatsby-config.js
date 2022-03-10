require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `Investigation`,
    description: `Astronomy`,
    author: ``,
  },
  plugins: [
    `gatsby-plugin-layout`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `locale`,
        path: `${__dirname}/src/data/locales`,
      },
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`,
        languages: [`en`, `es`],
        defaultLanguage: `en`,
        langKeyDefault: 'en',
        useLangKeyLayout: false,
        i18nextOptions: {
          debug: false,
          interpolation: {
            skipOnVariables: false,
            escapeValue: false, // not needed for react as it escapes by default
          },
          keySeparator: '.',
          nsSeparator: '::',
        },
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
        ignore: [`**/.*`], // ignore files starting with a dot
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-sass-resources`,
      options: {
        resources: [
          `${__dirname}/src/assets/stylesheets/_variables.scss`,
          `${__dirname}/src/assets/stylesheets/mixins/_index.scss`,
          `${__dirname}/src/assets/stylesheets/lib/_md-globals.scss`,
          `${__dirname}/src/assets/stylesheets/STACSS/_typography.scss`,
          `${__dirname}/src/assets/stylesheets/STACSS/_structure.scss`,
          `${__dirname}/src/assets/stylesheets/STACSS/_appearance.scss`,
        ],
      },
    },
    {
      resolve: `@danbruegge/gatsby-plugin-stylelint`,
      options: { configFile: './.stylelintrc', files: ['**/*.{css,scss}'] },
    },
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|.cache|public)/,
        stages: ['develop'],
        options: {
          emitWarning: true,
          failOnError: false,
        },
      },
    },
  ],
};
