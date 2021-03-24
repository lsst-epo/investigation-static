import React, { useGlobal } from 'reactn';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';

import { headerTitle, big, small } from './progress.module.scss';

const Progress = ({ className, type, showQuestions, showPages }) => {
  const [visitedPages] = useGlobal('visitedPages');
  const [totalPages] = useGlobal('totalPages');
  const [totalQAsByInvestigation] = useGlobal('totalQAsByInvestigation');
  const {
    answers: totalAnswered,
    questions: totalQuestions,
  } = totalQAsByInvestigation;
  const pagesProgress = (visitedPages.length / totalPages) * 100;
  const questionsProgress = (totalAnswered / totalQuestions) * 100;
  const classes = classnames(className, {
    [big]: type === 'big',
    [small]: type === 'small',
  });

  return (
    <div>
      {showPages && (
        <div className={classes}>
          <div className={headerTitle}>Pages Visited</div>
          <LinearProgress
            id="pages-bar"
            value={pagesProgress > 100 ? 100 : pagesProgress}
          />
        </div>
      )}
      {showQuestions && (
        <div className={classes}>
          <div className={headerTitle}>Questions Answered</div>
          <LinearProgress
            id="questions-bar"
            value={questionsProgress > 100 ? 100 : questionsProgress}
          />
        </div>
      )}
    </div>
  );
};

Progress.propTypes = {
  type: PropTypes.string,
  showQuestions: PropTypes.bool,
  showPages: PropTypes.bool,
  className: PropTypes.string,
};

Progress.defaultProps = {
  type: 'small',
  showQuestions: true,
  showPages: true,
};

export default Progress;
