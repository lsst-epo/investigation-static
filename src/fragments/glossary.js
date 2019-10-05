
import { graphql } from 'gatsby'

export const glossaryFieldsFragment = graphql`
  fragment GlossaryFields on Craft_glossary_glossary_Entry {
    id
    title
    definition
    slug
  }
`;