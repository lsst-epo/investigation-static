import React, { useGlobal } from 'reactn';
import PropTypes from 'prop-types';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';

import { headerTitle, big, small } from './progress.module.scss';

const Progress = ({ type }) => {
  const [visitedPages] = useGlobal('visitedPages');
  const [totalPages] = useGlobal('totalPages');
  const [totalQAsByInvestigation] = useGlobal('totalQAsByInvestigation');
  const {
    answers: totalAnswered,
    questions: totalQuestions,
  } = totalQAsByInvestigation;
  const pagesProgress = (visitedPages.length / totalPages) * 100;
  const questionsProgress = (totalAnswered / totalQuestions) * 100;
  const classes = type === 'big' ? big : small;

  return (
    <div>
      <div className={classes}>
        <div className={headerTitle}>Pages Visited</div>
        <LinearProgress id="pages-bar" value={pagesProgress} />
      </div>
      <div className={classes}>
        <div className={headerTitle}>Questions Answered</div>
        <LinearProgress id="questions-bar" value={questionsProgress} />
      </div>
    </div>
  );
};

Progress.propTypes = {
  type: PropTypes.string,
};

export default Progress;
