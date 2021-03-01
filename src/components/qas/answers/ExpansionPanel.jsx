import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from 'react-md/lib/Buttons/Button';
import FormattedAnswer from './FormattedAnswer';
import { qaReviewBlock } from '../styles.module.scss';

class AnswerExpansionPanel extends React.PureComponent {
  render() {
    const {
      id,
      pre,
      post,
      content,
      accessor,
      showEditButton,
      editHandler,
      qaReview,
    } = this.props;

    return (
      <div className="container-flex centered">
        {!qaReview && showEditButton && (
          <Button
            onClick={() => editHandler(id)}
            flat
            secondary
            className="outlined mini edit-button"
          >
            Change Answer
          </Button>
        )}
        <p
          id={`answer-content-${id}`}
          className={classnames({ [qaReviewBlock]: qaReview })}
        >
          <FormattedAnswer
            {...{ pre, post, qaReview }}
            type={accessor}
            body={content}
          />
        </p>
      </div>
    );
  }
}

AnswerExpansionPanel.propTypes = {
  id: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  accessor: PropTypes.string,
  pre: PropTypes.string,
  post: PropTypes.string,
  showEditButton: PropTypes.bool,
  editHandler: PropTypes.func,
  qaReview: PropTypes.bool,
};

export default AnswerExpansionPanel;
