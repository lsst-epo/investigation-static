import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../components/site/button';
import Close from '../components/site/icons/Close';
import DragHandle from '../components/site/icons/DragHandle';
import styles from './scatter-plot-selector-container.module.scss';

const ScatterPlotSelector = ({ children, opened, handleClick }) => {
  const containerClasses = classnames(styles.container, {
    [styles.innerOpen]: opened,
  });
  const toggleClasses = classnames(styles.toggle, {
    [styles.toggleOpen]: opened,
  });

  return (
    <div className={containerClasses}>
      <Button className={toggleClasses} onClick={handleClick} flat>
        {!opened ? <DragHandle /> : <Close />}
      </Button>
      <div className={styles.inner}>{children}</div>
    </div>
  );
};

ScatterPlotSelector.propTypes = {
  children: PropTypes.node,
  opened: PropTypes.bool,
  handleClick: PropTypes.func,
};

export default ScatterPlotSelector;
