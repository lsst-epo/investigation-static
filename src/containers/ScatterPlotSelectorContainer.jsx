import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'react-md';
import Button from '../components/site/button';
import ScatterPlot from '../components/site/icons/ScatterPlot';
import Close from '../components/site/icons/Close';

import './scatter-plot-selector-container.scss';

const ScatterPlotSelector = ({ children, opened, handleClick }) => {
  const settings = {
    ...{
      opened: false,
    },
    opened,
  };
  return (
    <>
      <div
        className={`scatter-plot-selector--container ${
          settings.opened ? 'opened' : ''
        }`}
      >
        <Button className="scatter-plot-toggle" onClick={handleClick} flat>
          {!opened ? <ScatterPlot /> : <Close />}
        </Button>
        <div className="scatter-plot">{children}</div>
      </div>
    </>
  );
};

ScatterPlotSelector.propTypes = {
  children: PropTypes.node,
  opened: PropTypes.bool,
  handleClick: PropTypes.func,
};

export default ScatterPlotSelector;
