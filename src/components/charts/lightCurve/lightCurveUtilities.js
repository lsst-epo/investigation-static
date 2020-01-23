import isEmpty from 'lodash/isEmpty';
import { zoomIdentity as d3ZoomIdentity } from 'd3-zoom';

export const distance2 = (p, point) => {
  const dx = p.x - point[0];
  const dy = p.y - point[1];
  return dx * dx + dy * dy;
};

export const closestPoint = (pathNode, point) => {
  const pathLength = pathNode.getTotalLength();
  let precision = 8;
  let best;
  let bestLength;
  let bestDistance = Infinity;
  // linear scan for coarse approximation

  for (
    let scan, scanLength = 0, scanDistance;
    scanLength <= pathLength;
    scanLength += precision
  ) {
    scan = pathNode.getPointAtLength(scanLength);
    scanDistance = distance2(scan, point);
    if (scanDistance < bestDistance) {
      best = scan;
      bestLength = scanLength;
      bestDistance = scanDistance;
    }
  }

  // binary search for precise estimate
  precision /= 2;
  while (precision > 0.5) {
    const beforeLength = bestLength - precision;
    const afterLength = bestLength + precision;
    const before = pathNode.getPointAtLength(beforeLength);
    const after = pathNode.getPointAtLength(afterLength);
    const beforeDistance = distance2(before, point);
    const afterDistance = distance2(after, point);

    if (beforeLength >= 0 && beforeDistance < bestDistance) {
      best = before;
      bestLength = beforeLength;
      bestDistance = beforeDistance;
    } else if (afterLength <= pathLength && afterDistance < bestDistance) {
      best = after;
      bestLength = afterLength;
      bestDistance = afterDistance;
    } else {
      precision /= 2;
    }
  }

  best = [best.x, best.y];
  best.distance = Math.sqrt(bestDistance);

  return best;
};

export const getPeakMagAnswer = (answerId, answers) => {
  const answer = answers[answerId];
  const isAnswered = !isEmpty(answer);
  const empty = { x: null, y: null, value: null, peakMagAnswerId: answerId };

  if (isAnswered) {
    return { ...empty, ...answer.data };
  }

  return empty;
};

export const getTemplateAnswer = (templates, typeOrAnswerId, answers) => {
  const answer = answers[typeOrAnswerId];
  const isAnswered = !isEmpty(answer);
  const empty = {
    transform: d3ZoomIdentity,
    type: '',
    templateAnswerId: typeOrAnswerId,
  };

  if (isAnswered) {
    return {
      ...empty,
      transform: isAnswered ? answer.data.data : null,
      type: isAnswered ? answer.data.type : null,
    };
  }

  if (!templates) {
    return empty;
  }

  if (templates.length === 1) {
    return {
      ...empty,
      type: templates[0],
    };
  }

  return empty;
};
