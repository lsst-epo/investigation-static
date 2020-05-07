import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
import isEmpty from 'lodash/isEmpty';
import 'd3-transition';
import { capitalize, extentFromSet, getValue } from '../../../lib/utilities.js';
import Unit from './unit/index.jsx';

class Tooltip extends React.PureComponent {
  constructor(props) {
    super(props);

    this.el = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { data, posX, posY, show } = this.props;
    const { show: isVisible, data: prevData } = prevProps;
    const dataEmpty = isEmpty(data);
    const $tooltip = d3Select(this.el.current);
    if (show && !isVisible && !dataEmpty) {
      console.log(posX, posY);
      this.show($tooltip, data, posX, posY, show);
    } else if (show && isVisible && data !== prevData && !dataEmpty) {
      this.move($tooltip, data, posX, posY, show);
    } else if (!show) {
      this.hide($tooltip, show);
    }
  }

  getXPos(x, el) {
    const { graph } = this.props;
    const { width } = el.node().getBoundingClientRect();

    if (graph === 'scatter') {
      return `${x + 16 - width / 2}px`;
    }

    if (graph === 'histogram') {
      return `${x - width / 2 < 0 ? 0 : x - width / 2}px`;
    }

    return `${x < 0 ? 0 : x}px`;
  }

  getYPos(y, el) {
    const { graph } = this.props;
    const { height } = el.node().getBoundingClientRect();

    if (graph === 'scatter') {
      return `${y - 24 - height}px`;
    }

    if (graph === 'histogram') {
      return `${y + height}px`;
    }

    return `${y}px`;
  }

  show($tooltip, data, posX, posY) {
    $tooltip
      .style('left', this.getXPos(posX, $tooltip))
      .style('top', this.getYPos(posY, $tooltip))
      .transition()
      .duration(400)
      .style('opacity', 1);
  }

  move($tooltip, data, posX, posY) {
    $tooltip
      .style('opacity', 1)
      .transition()
      .duration(400)
      .style('left', this.getXPos(posX, $tooltip))
      .style('top', this.getYPos(posY, $tooltip));
  }

  hide($tooltip) {
    $tooltip
      .transition()
      .duration(400)
      .style('opacity', 0);
  }

  renderValue(accessor, data, unit) {
    return (
      <>
        <span>{getValue(accessor, data)}</span>
        {unit ? (
          <span className="unit">&nbsp;({unit})</span>
        ) : (
          <Unit type={accessor} />
        )}
      </>
    );
  }

  renderRange(accessor, data, unit) {
    const minMax = extentFromSet(data, accessor);

    return (
      <>
        {this.renderValue(accessor, minMax[0], unit)}
        {` – `}
        {this.renderValue(accessor, minMax[1], unit)}
      </>
    );
  }

  renderAccessor(accessor, label, data, unit) {
    const isCount = accessor === 'count';

    let content = '';

    if (isCount) {
      content = this.renderValue(accessor, data.length, unit || label);
    } else if (data.length > 1) {
      content = this.renderRange(accessor, data, unit);
    } else if (data.length === 1) {
      content = this.renderValue(accessor, data[0][accessor], unit);
    }

    return (
      <div className="value-row" key={accessor}>
        {!isCount && <span>{label || capitalize(accessor)}: </span>}
        {content}
      </div>
    );
  }

  render() {
    const { data, accessors, units, labels } = this.props;

    return (
      <>
        {data && (
          <div
            data-testid="tooltip"
            ref={this.el}
            style={{ opacity: 0 }}
            className="tooltip"
          >
            {accessors.map((accessor, i) => {
              const label = labels ? labels[i] : null;
              const unit = units ? units[i] : null;

              return this.renderAccessor(accessor, label, data, unit);
            })}
          </div>
        )}
      </>
    );
  }
}

Tooltip.defaultProps = {
  graph: 'scatter',
  units: [],
};

Tooltip.propTypes = {
  graph: PropTypes.string,
  data: PropTypes.array,
  posX: PropTypes.number,
  posY: PropTypes.number,
  show: PropTypes.bool,
  accessors: PropTypes.array,
  units: PropTypes.array,
  labels: PropTypes.array,
};

export default Tooltip;
