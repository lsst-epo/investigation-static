import { graphql } from 'gatsby';

export const iamgeFragment = graphql`
  fragment Image on PagesJsonImages {
    mediaPath
    altText
    layout {
      col
      row
    }
  }
`;
