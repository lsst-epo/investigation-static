import { graphql } from 'gatsby';

export const nestedWidgetOptionsFragment = graphql`
  fragment NestedWidgetOptions on PagesJsonWidgetsWidgetsOptions {
    title
    domain
    yAxisLabel
    xAxisLabel
    xValueAccessor
    tooltipAccessors
    tooltipLabels
    bins
  }
`;

export const widgetOptionsFragment = graphql`
  fragment WidgetOptions on PagesJsonWidgetsOptions {
    title
    hideSubHeadTitle
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
    hideControls
    hideImage
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
    bins
    required
    defaultZoom
    objectName
    questionId
    potentialOrbits
    noDetails
    observations {
      id
      label
      interactable
      isActive
      position
    }
    refObjs
  }
`;
