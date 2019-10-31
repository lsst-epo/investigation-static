import React from 'react';
import PropTypes from 'prop-types';
// import includes from 'lodash/includes';
import Button from 'react-md/lib/Buttons/Button';
// import StellarValue from '../charts/shared/StellarValue';
// import StellarValueRange from '../charts/shared/StellarValueRange';
import FormattedAnswer from './FormattedAnswer';

class AnswerExpansionPanel extends React.PureComponent {
  render() {
    const {
      id,
      pre,
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
          <FormattedAnswer pre={pre} type={accessor} body={content} />
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
  showEditButton: PropTypes.bool,
  editHandler: PropTypes.func,
};

export default AnswerExpansionPanel;
