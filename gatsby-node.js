require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

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

const { INVESTIGATION } = process.env;
const isAll = INVESTIGATION === 'all' || !INVESTIGATION;

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const investigationsResponse = await graphql(`
    query {
      allInvestigationsJson {
        nodes {
          id
          title
        }
      }
    }
  `);

  const investigations =
    investigationsResponse.data.allInvestigationsJson.nodes;

  let pages = {};

  if (INVESTIGATION === 'exploding-stars') {
    pages = await graphql(`
      query {
        allPagesJson(
          filter: { investigation: { eq: "exploding-stars" } }
          sort: { fields: [order, investigation], order: ASC }
        ) {
          nodes {
            order
            id
            investigation
            slug
          }
        }
      }
    `);
  } else if (INVESTIGATION === 'expanding-universe') {
    pages = await graphql(`
      query {
        allPagesJson(
          filter: { investigation: { eq: "expanding-universe" } }
          sort: { fields: [order, investigation], order: ASC }
        ) {
          nodes {
            order
            id
            investigation
            slug
          }
        }
      }
    `);
  } else if (INVESTIGATION === 'observable-universe') {
    pages = await graphql(`
      query {
        allPagesJson(
          filter: { investigation: { eq: "observable-universe" } }
          sort: { fields: [order, investigation], order: ASC }
        ) {
          nodes {
            order
            id
            investigation
            slug
          }
        }
      }
    `);
  } else if (INVESTIGATION === 'solar-system') {
    pages = await graphql(`
      query {
        allPagesJson(
          filter: { investigation: { eq: "solar-system" } }
          sort: { fields: [order, investigation], order: ASC }
        ) {
          nodes {
            order
            id
            investigation
            slug
          }
        }
      }
    `);
  } else if (INVESTIGATION === 'hazardous-asteroids') {
    pages = await graphql(`
      query {
        allPagesJson(
          filter: { investigation: { eq: "hazardous-asteroids" } }
          sort: { fields: [order, investigation], order: ASC }
        ) {
          nodes {
            order
            id
            investigation
            slug
          }
        }
      }
    `);
  } else {
    pages = await graphql(`
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
  }

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

  // Landing page for 1 or more investigations
  createPage({
    path: `/`,
    component: path.resolve(`./src/containers/LandingContainer.jsx`),
    context: { investigations, env: INVESTIGATION },
  });

  if (isAll) {
    investigations.forEach(investigation => {
      const { id } = investigation;
      createPage({
        path: `/${id}/last-page/`,
        component: path.resolve(`./src/containers/EndingContainer.jsx`),
        context: { investigations, investigation: id, env: INVESTIGATION },
      });
    });
  } else {
    createPage({
      path: '/last-page/',
      component: path.resolve(`./src/containers/EndingContainer.jsx`),
      context: { investigations, env: INVESTIGATION },
    });
  }

  pages.data.allPagesJson.nodes.forEach(page => {
    const { id, slug, investigation } = page;

    createPage({
      path: isAll ? `/${investigation}/${slug}` : `/${slug}`,
      component: path.resolve(`./src/containers/PageContainer.jsx`),
      context: {
        id,
        investigation,
        env: INVESTIGATION,
      },
    });
  });
};
