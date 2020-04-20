import { graphql } from 'gatsby';

export const pageMetaFragment = graphql`
  fragment PageMeta on PagesJson {
    id
    investigation
    layout
    slug
    title
    content
    next {
      title
      link
    }
    previous {
      title
      link
    }
  }
`;
