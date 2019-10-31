import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
import 'd3-transition';
import { capitalize, extentFromSet, getValue } from '../../../lib/utilities.js';
import StellarUnit from './StellarUnit';

class Tooltip extends React.PureComponent {
  static defaultProps = {
    graph: 'scatter',
  };

  constructor(props) {
    super(props);

    this.el = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { data, posX, posY, show } = this.props;
    const { show: isVisible, data: prevData } = prevProps;
    const $tooltip = d3Select(this.el.current);

    if (show && !isVisible) {
      this.show($tooltip, data, posX, posY, show);
    } else if (show && isVisible && data !== prevData) {
      this.move($tooltip, data, posX, posY, show);
    } else if (!show) {
      this.hide($tooltip, show);
    }
  }

  getXPos(x, el) {
    return `${x + 16 - el.node().getBoundingClientRect().width / 2}px`;
  }

  getYPos(y, el) {
    const { graph } = this.props;
    const bBox = el.node().getBoundingClientRect();

    if (graph === 'scatter') {
      return `${y - 24 - bBox.height}px`;
    }

    if (graph === 'histogram') {
      return `${y - bBox.height}px`;
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

  renderValue(accessor, data) {
    return (
      <React.Fragment>
        <span>{getValue(accessor, data)}</span>
        <StellarUnit type={accessor} />
      </React.Fragment>
    );
  }

  renderRange(accessor, data) {
    const minMax = extentFromSet(data, accessor);

    return (
      <React.Fragment>
        {this.renderValue(accessor, minMax[0])}
        {` – `}
        {this.renderValue(accessor, minMax[1])}
      </React.Fragment>
    );
  }

  renderAccessor(accessor, data) {
    return (
      <div className="value-row">
        <span>{capitalize(accessor)}: </span>
        {data.length > 1 && this.renderRange(accessor, data)}
        {data.length === 1 && this.renderValue(accessor, data[0][accessor])}
      </div>
    );
  }

  render() {
    const { data, accessors } = this.props;

    return (
      <React.Fragment>
        {data && (
          <div ref={this.el} style={{ opacity: 0 }} className="tooltip">
            {data.length > 1 && (
              <div className="value-row">{data.length} stars</div>
            )}
            {accessors.map(accessor => {
              return this.renderAccessor(accessor, data);
            })}
          </div>
        )}
      </React.Fragment>
    );
  }
}

Tooltip.propTypes = {
  graph: PropTypes.string,
  data: PropTypes.object,
  posX: PropTypes.number,
  posY: PropTypes.number,
  show: PropTypes.bool,
  accessors: PropTypes.array,
};

export default Tooltip;
