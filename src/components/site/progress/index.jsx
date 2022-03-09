import React, { useGlobal } from 'reactn';
import PropTypes from 'prop-types';
import { Trans } from 'gatsby-plugin-react-i18next';
import classnames from 'classnames';
import LinearProgress from '../linearProgress';

import { headerTitle, big, small } from './progress.module.scss';

const Progress = ({ className, type, showQuestions, showPages }) => {
  const [visitedPages] = useGlobal('visitedPages');
  const [totalPages] = useGlobal('totalPages');
  const [totalQAsByInvestigation] = useGlobal('totalQAsByInvestigation');
  const {
    answers: totalAnswered,
    questions: totalQuestions,
  } = totalQAsByInvestigation;

  const pagesProgress = Math.round((visitedPages.length / totalPages) * 100);
  const questionsProgress = Math.round((totalAnswered / totalQuestions) * 100);

  const classes = classnames(className, {
    [big]: type === 'big',
    [small]: type === 'small',
  });

  return (
    <div>
      {showPages && (
        <div className={classes}>
          <div id="pagesBarLabel" className={headerTitle}>
            <Trans>interface::table_of_contents.progress.pages_visited</Trans>
          </div>
          <LinearProgress
            id="pages-bar"
            value={pagesProgress > 100 ? 100 : pagesProgress}
            labelledById="pagesBarLabel"
          />
        </div>
      )}
      {showQuestions && (
        <div className={classes}>
          <div id="questionsBarId" className={headerTitle}>
            <Trans>
              interface::table_of_contents.progress.questions_answered
            </Trans>
          </div>
          <LinearProgress
            id="questions-bar"
            value={questionsProgress > 100 ? 100 : questionsProgress}
            labelledById="questionsBarId"
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
