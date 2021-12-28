import { graphql } from 'gatsby';

export const referenceFragment = graphql`
  fragment Reference on PagesJsonReference {
    modal {
      title
      content
    }
  }
`;
