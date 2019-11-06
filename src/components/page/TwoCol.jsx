/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import QAs from '../qas';
import Placeholder from '../placeholder';
import { renderDef } from '../../lib/utilities.js';

class TwoCol extends React.PureComponent {
  render() {
    const {
      title,
      content,
      questions,
      answers,
      activeId,
      answerHandler,
      setActive,
      advanceActive,
    } = this.props;

    return (
      <div className="container-flex spaced">
        <div className="col padded col-width-50">
          <section>
            <h2 className="section-title">{title}</h2>
            <div dangerouslySetInnerHTML={renderDef(content)} />
            {questions && (
              <QAs
                questions={questions}
                answers={answers}
                activeId={activeId}
                answerHandler={answerHandler}
                advanceActive={advanceActive}
                setActive={setActive}
              />
            )}
          </section>
        </div>
        <div className="col padded col-width-50 col-fixed">
          <Placeholder />
        </div>
      </div>
    );
  }
}

export default TwoCol;

TwoCol.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  questions: PropTypes.array,
  answers: PropTypes.object,
  activeId: PropTypes.string,
  answerHandler: PropTypes.func,
  setActive: PropTypes.func,
  advanceActive: PropTypes.func,
};
