import { graphql } from 'gatsby';

export const tableFragment = graphql`
  fragment Content on PagesJsonContents {
    layout {
      col
      row
    }
    content
  }
`;
