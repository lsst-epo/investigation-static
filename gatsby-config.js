require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `Supernovae`,
    description: `LSST EPO Astronomy Investigation`,
    author: `@lsst-epo/core`,
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
    'gatsby-plugin-optimize-svgs',
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#087f80`,
        theme_color: `#087f80`,
        display: `minimal-ui`,
        icon: `src/images/lsst-logo.svg`, // This path is relative to the root of the site.
      },
    },
    // {
    //   resolve: 'gatsby-source-graphql',
    //   options: {
    //     typeName: 'CraftGraphQL',
    //     fieldName: 'craft',
    //     // Url to query from
    //     url: 'http://craft-test.test/api',
    //     // HTTP headers
    //     headers: {
    //       // Learn about environment variables: https://gatsby.dev/env-vars
    //       Authorization: `bearer ${process.env.GRAPHQL_TOKEN}`,
    //     },
    //     // Additional options to pass to node-fetch
    //     fetchOptions: {},
    //   },
    // },
    // {
    //   resolve: 'gatsby-source-graphql',
    //   options: {
    //     // This type will contain remote schema Query type
    //     typeName: 'CraftQL',
    //     // This is the field under which it's accessible
    //     fieldName: 'craftql',
    //     // URL to query from
    //     url: 'http://craft-test.test/api-craftql',
    //     // HTTP headers
    //     headers: {
    //       Authorization: `bearer ${process.env.CRAFTQL_TOKEN}`,
    //     },
    //   },
    // },
    {
      resolve: 'gatsby-plugin-react-axe',
      options: {
        // Integrate react-axe in production. This defaults to false.
        showInProduction: false,

        // Options to pass to axe-core.
        // See: https://github.com/dequelabs/axe-core/blob/master/doc/API.md#api-name-axeconfigure
        axeOptions: {
          // Your axe-core options.
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
