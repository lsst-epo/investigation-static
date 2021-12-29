import { graphql } from 'gatsby';

export const imagesFragment = graphql`
  fragment Images on PagesJsonReference {
    images {
      mediaPath
      altText
      figText
    }
  }
`;

export const referenceFragment = graphql`
  fragment Reference on PagesJsonReference {
    title
    ...Images
  }
`;
