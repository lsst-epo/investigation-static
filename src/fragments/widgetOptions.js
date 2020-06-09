import { graphql } from 'gatsby';

export const nestedWidgetOptionsFragemnt = graphql`
  fragment NestedWidgetOptions on PagesJsonWidgetsWidgetsOptions {
    title
    domain
    yAxisLabel
    xAxisLabel
    xValueAccessor
    tooltipAccessors
    tooltipLabels
  }
`;

export const widgetOptionsFragemnt = graphql`
  fragment WidgetOptions on PagesJsonWidgetsOptions {
    title
    showSelector
    showLightCurve
    showUserPlot
    createUserHubblePlot
    hubbleConstant
    userTrendline
    lightCurveTemplates
    choosePeakMagnitude
    chooseLightCurveTemplate
    preSelectedLightCurveTemplate
    preSelectedLightCurveMagnitude
    toggleDataPointsVisibility
    randomSource
    autoplay
    preSelected
    multiple
    domain
    xAxisLabel
    yAxisLabel
    xValueAccessor
    yValueAccessor
    tooltipAccessors
    tooltipUnits
    tooltipLabels
    paused
    pov
  }
`;
