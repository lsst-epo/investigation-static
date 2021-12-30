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

export const buttonFragment = graphql`
  fragment Button on PagesJsonReference {
    button {
      icon
      iconEl
      text
    }
  }
`;

export const referenceFragment = graphql`
  fragment Reference on PagesJsonReference {
    title
    ...Button
    ...Images
  }
`;
