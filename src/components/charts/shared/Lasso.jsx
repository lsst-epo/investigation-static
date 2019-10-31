import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { select as d3Select, event as d3Event } from 'd3-selection';
import { drag as d3Drag } from 'd3-drag';
import {
  line as d3Line,
  curveCardinal as d3CurveCardinal,
  curveCardinalClosed as d3CurveCardinalClosed,
} from 'd3-shape';
import classifyPoint from 'robust-point-in-polygon';

class Lasso extends React.Component {
  constructor(props) {
    super(props);

    this.draggablePathEl = React.createRef();
  }

  componentDidUpdate() {
    const {
      lassoableEl,
      dragStartCallback,
      dragCallback,
      dragEndCallback,
    } = this.props;
    const $scatterplot = d3Select(lassoableEl.current);
    const $allPoints = d3Select(lassoableEl.current).selectAll('.data-point');

    const $dragLine = d3Line();
    $scatterplot.call(
      d3Drag()
        .container(function containerSpecifier() {
          return this;
        })
        .subject(function position() {
          const p = [d3Event.x, d3Event.y];
          return [p, p];
        })
        .on('start', () => {
          // d3Event.sourceEvent.stopPropagation();
          const d = d3Event.subject;
          const $active = d3Select(this.draggablePathEl.current);

          $active.datum(d);
          let x0 = d3Event.x;
          let y0 = d3Event.y;

          if (dragStartCallback) {
            dragStartCallback(d);
          }
          // console.log('start');
          d3Event.on('drag', () => {
            // d3Event.sourceEvent.stopPropagation();
            const x1 = d3Event.x;
            const y1 = d3Event.y;
            const dx = x1 - x0;
            const dy = y1 - y0;

            if (dx * dx + dy * dy > 100) {
              d.push([(x0 = x1), (y0 = y1)]);
            } else {
              d[d.length - 1] = [x1, y1];
              $active.attr('d', $dragLine.curve(d3CurveCardinal));
            }

            if (dragCallback) {
              dragCallback(d);
            }
            // console.log('dragging');

            d3Event.on('end', () => {
              const $filtered = $allPoints.filter((nodeData, i, nodes) => {
                const nodePos = [
                  Math.floor(d3Select(nodes[i]).attr('cx')),
                  Math.floor(d3Select(nodes[i]).attr('cy')),
                ];
                const classification = classifyPoint(d, nodePos);

                return classification === -1;
              });

              $active.attr('d', $dragLine.curve(d3CurveCardinalClosed));

              if (dragEndCallback) {
                dragEndCallback($filtered.data());
              }
              // console.log('end');
            });
          });
        })
    );
    // console.log(d3Event);
  }

  render() {
    const { active } = this.props;
    const lassoClasses = classnames('lasso', { active });
    return <path ref={this.draggablePathEl} className={lassoClasses} />;
  }
}

Lasso.propTypes = {
  lassoableEl: PropTypes.node,
  active: PropTypes.bool,
  dragStartCallback: PropTypes.func,
  dragCallback: PropTypes.func,
  dragEndCallback: PropTypes.func,
};

export default Lasso;
