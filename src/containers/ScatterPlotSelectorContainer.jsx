import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../components/site/button';
import ButtonIcon from '../components/site/button/ButtonIcon';
import Close from '../components/site/icons/Close';
import DragHandle from '../components/site/icons/DragHandle';
import {
  toggle,
  innerOpen,
  toggleOpen,
  container,
  inner,
} from './scatter-plot-selector-container.module.scss';

const ScatterPlotSelector = ({ children, opened, onSlideOutClick }) => {
  const containerClasses = classnames(container, {
    [innerOpen]: opened,
  });
  const toggleClasses = classnames(toggle, {
    [toggleOpen]: opened,
  });

  return (
    <div className={containerClasses}>
      <Button className={toggleClasses} onClick={onSlideOutClick} flat>
        {!opened ? (
          <ButtonIcon srText="Open Plotter" Icon={DragHandle} />
        ) : (
          <ButtonIcon srText="Close Plotter" Icon={Close} />
        )}
      </Button>
      <div className={inner}>{children}</div>
    </div>
  );
};

ScatterPlotSelector.propTypes = {
  children: PropTypes.node,
  opened: PropTypes.bool,
  onSlideOutClick: PropTypes.func,
};

export default ScatterPlotSelector;
