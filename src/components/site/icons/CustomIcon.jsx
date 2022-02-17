import React from 'react';
import PropTypes from 'prop-types';

import arrowDown from './ArrowDown';
import arrowLeft from './ArrowLeft';
import arrowRight from './ArrowRight';
import barChart from './BarChart';
import caretDown from './CaretDown';
import check from './Check';
import checkBox from './CheckBox';
import checkBoxOutlineBlank from './CheckBoxOutlineBlank';
import checkmark from './Checkmark';
import checkpoint from './Checkpoint';
import close from './Close';
import dragHandle from './DragHandle';
import edit from './Edit';
import fastForward from './FastForward';
import finish from './Finish';
import galaxy from './Galaxy';
import indeterminateCheckBox from './IndeterminateCheckBox';
import lightbulb from './Lightbulb';
import menu from './Menu';
import more from './More';
import pause from './Pause';
import play from './Play';
import questionMark from './QuestionMark';
import replay from './Replay';
import rewind from './Rewind';
import scatterPlot from './ScatterPlot';
import speed from './Speed';
import star from './Star';
import stop from './Stop';
import sun from './Sun';
import viewList from './ViewList';

const icons = {
  arrowDown,
  arrowLeft,
  arrowRight,
  barChart,
  caretDown,
  check,
  checkBox,
  checkBoxOutlineBlank,
  checkmark,
  checkpoint,
  close,
  dragHandle,
  edit,
  fastForward,
  finish,
  galaxy,
  indeterminateCheckBox,
  lightbulb,
  menu,
  more,
  pause,
  play,
  questionMark,
  replay,
  rewind,
  scatterPlot,
  speed,
  star,
  stop,
  sun,
  viewList,
};

const CustomIcon = props => {
  const { name } = props || {};

  const CIcon = icons[name || 'star'];

  return <CIcon {...props} />;
};

CustomIcon.propTypes = {
  name: PropTypes.string,
};

export default CustomIcon;
