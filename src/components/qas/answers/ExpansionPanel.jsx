import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';
import FormattedAnswer from './FormattedAnswer';

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
    } = this.props;

    return (
      <div className="container-flex centered">
        {showEditButton && (
          <Button
            onClick={() => editHandler(id)}
            flat
            secondary
            className="outlined mini edit-button"
          >
            Change Answer
          </Button>
        )}
        <p id={`answer-content-${id}`}>
          <FormattedAnswer {...{ pre, post }} type={accessor} body={content} />
        </p>
      </div>
    );
  }
}

AnswerExpansionPanel.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string,
  accessor: PropTypes.string,
  pre: PropTypes.string,
  post: PropTypes.string,
  showEditButton: PropTypes.bool,
  editHandler: PropTypes.func,
};

export default AnswerExpansionPanel;
