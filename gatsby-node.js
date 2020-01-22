/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`);

exports.onCreateWebpackConfig = ({ getConfig, stage, loaders, actions }) => {
  const config = getConfig();
  if (stage.startsWith('develop') && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom',
    };
  }

  if (stage.startsWith('develop')) {
    actions.setWebpackConfig({
      devtool: 'eval-source-map',
    });
  }

  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /echarts-gl/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
  const { createPage } = actions;
  // expanding-universe
  // exploding-stars
  // filter: { investigation: { eq: "expanding-universe" } }
  const pages = await graphql(`
    query {
      allPagesJson(sort: { fields: [order, investigation], order: ASC }) {
        nodes {
          order
          id
          investigation
          slug
        }
      }
    }
  `);

  // Part of POC of multi-site, but not useful at this point: DON'T DELETE
  // const result = await graphql(`
  //   query {
  //     craft {
  //       entries(site: "*") {
  //         ... on CraftGraphQL_glossary_glossary_Entry {
  //           id
  //           color
  //           siteId
  //           slug
  //         }
  //       }
  //     }
  //     craftql {
  //       sites {
  //         id
  //         language
  //         primary
  //         name
  //       }
  //     }
  //   }
  // `);

  // Part of POC of multi-site, but not useful at this point: DON'T DELETE
  // const sites = {};
  // result.data.craftql.sites.forEach(site => {
  //   sites[site.id] = site;
  // });
  // result.data.craft.entries.forEach(entry => {
  //   const { id, siteId } = entry;
  //   const { primary, language } = sites[siteId];
  //   const langBase = primary ? '/' : `/${language}/`;
  //   createPage({
  //     path: `${langBase}glossary/${entry.slug}`,
  //     component: path.resolve(`./src/containers/GlossaryItemContainer.jsx`),
  //     context: {
  //       id: +id,
  //       site: '' + siteId,
  //       language,
  //     },
  //   });
  // });

  pages.data.allPagesJson.nodes.forEach(page => {
    const { id, slug, investigation, order } = page;

    if (order === '00') {
      createPage({
        path: `/${investigation}`,
        component: path.resolve(`./src/containers/PageContainer.jsx`),
        context: {
          id,
          investigation,
        },
      });
    }

    createPage({
      path: `/${investigation}/${slug}`,
      component: path.resolve(`./src/containers/PageContainer.jsx`),
      context: {
        id,
        investigation,
      },
    });
  });
};
