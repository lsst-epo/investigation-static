import { graphql } from 'gatsby';

export const nestedWidgetFragment = graphql`
  fragment NestedWidget on PagesJsonWidgetsWidgets {
    type
    source
    options {
      ...NestedWidgetOptions
    }
  }
`;

export const widgetFragment = graphql`
  fragment Widget on PagesJsonWidgets {
    type
    source
    sources
    widgets {
      ...NestedWidget
    }
    layout {
      col
      row
    }
    options {
      ...WidgetOptions
    }
  }
`;
