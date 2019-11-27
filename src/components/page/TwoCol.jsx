/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import QAs from '../qas';
import { renderDef } from '../../lib/utilities.js';

class TwoCol extends React.PureComponent {
  render() {
    const {
      title,
      content,
      widget,
      image,
      questions,
      answers,
      activeId,
      answerHandler,
      setActive,
      advanceActive,
      MediaTag,
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
          <MediaTag questions={questions} {...widget} {...image} />
        </div>
      </div>
    );
  }
}

export default TwoCol;

TwoCol.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  MediaTag: PropTypes.func,
  image: PropTypes.string,
  widget: PropTypes.object,
  questions: PropTypes.array,
  answers: PropTypes.object,
  activeId: PropTypes.string,
  answerHandler: PropTypes.func,
  setActive: PropTypes.func,
  advanceActive: PropTypes.func,
};
