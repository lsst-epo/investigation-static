import { graphql } from 'gatsby';

export const nestedWidgetOptionsFragment = graphql`
  fragment NestedWidgetOptions on PagesJsonWidgetsWidgetsOptions {
    title
    icon
    domain
    yAxisLabel
    xAxisLabel
    xValueAccessor
    yValueAccessor
    svgShapes
    color
    tooltipAccessors
    tooltipLabels
    bins
    qaReview
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
    preSelectedId
    preSelectedLightCurveTemplate
    preSelectedLightCurveMagnitude
    toggleDataPointsVisibility
    hideControls
    hideImage
    randomSource
    autoplay
    loop
    preSelected
    multiple
    svgShapes
    color
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
    noLabels
    detailsSet
    qaReview
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
