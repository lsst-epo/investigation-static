import { graphql } from 'gatsby';

export const tableFragment = graphql`
  fragment Table on PagesJsonTables {
    id
    title
    layout {
      col
      row
    }
    fixed
    colTitles
    rowTitles
    rows {
      accessor
      id
      content
    }
    qaReview
  }
`;
