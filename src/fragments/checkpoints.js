import { graphql } from 'gatsby';

export const checkpointFragment = graphql`
  fragment Checkpoint on PagesJsonCheckpoints {
    layout {
      col
      row
    }
  }
`;
