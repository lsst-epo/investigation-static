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

export const tableFragment = graphql`
  fragment Tables on PagesJsonReference {
    tables {
      id
      layout {
        col
        row
      }
      colTitles
      rowTitles
      rows {
        accessor
        id
        content
      }
      qaReview
    }
  }
`;

export const referenceFragment = graphql`
  fragment Reference on PagesJsonReference {
    title
    ...Button
    ...Images
    content
  }
`;
