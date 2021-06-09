import { graphql } from 'gatsby';

export const videoFragment = graphql`
  fragment Video on PagesJsonVideos {
    mediaPath
    altText
    figText
    options {
      autoPlay
      showControls
      loop
      volume
      width
      height
    }
    layout {
      col
      row
    }
  }
`;
