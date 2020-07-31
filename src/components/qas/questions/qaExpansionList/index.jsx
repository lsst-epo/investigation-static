/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import ExpansionList from 'react-md/lib/ExpansionPanels/ExpansionList';
import QAExpansionPanel from './QAExpansionPanel';
// import './styles.module.scss';

class QAExpansionList extends React.PureComponent {
  toggleHandler = () => {
    return null;
  };

  render() {
    const {
      questionNumber,
      question,
      answer,
      answerHandler: cancelHandler,
      activeId,
      saveHandler,
      editHandler,
    } = this.props;
    const { id } = question;

    return (
      <ExpansionList className="unstyled">
        <QAExpansionPanel
          {...this.props}
          key={`qa-${id}`}
          questionNumber={questionNumber}
          question={question}
          answer={answer}
          active={activeId === id}
          toggleHandler={this.toggleHandler}
          cancelHandler={cancelHandler}
          saveHandler={saveHandler}
          editHandler={editHandler}
        />
      </ExpansionList>
    );
  }
}

QAExpansionList.propTypes = {
  questionNumber: PropTypes.number,
  question: PropTypes.object,
  answer: PropTypes.object,
  activeId: PropTypes.string,
  answerHandler: PropTypes.func,
  saveHandler: PropTypes.func,
  editHandler: PropTypes.func,
};

export default QAExpansionList;
