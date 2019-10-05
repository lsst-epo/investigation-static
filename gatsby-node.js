/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)
exports.createPages = async ({ graphql, actions }) => {
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
  const { createPage } = actions;
  const result = await graphql(`
    query {
      craft {
        entries(type: "glossary") {
          ... on Craft_glossary_glossary_Entry {
            id
            slug
          }
        }
      }
    }
  `)

  result.data.craft.entries.forEach(entry => {
    createPage({
      path: entry.slug,
      component: path.resolve(`./src/templates/GlossaryItemContainer.jsx`),
      context: { id: +entry.id },
    })
  })
}