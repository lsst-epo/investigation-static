/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import QAs from '../qas';
import { renderDef } from '../../lib/utilities.js';

class Page extends React.PureComponent {
  render() {
    const {
      layout,
      title,
      content,
      MediaTag,
      image,
      widget,
      questions,
      answers,
      activeId,
      answerHandler,
      setActive,
      advanceActive,
    } = this.props;

    return (
      <div>
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
        <br />
        <MediaTag
          questions={questions}
          layout={layout}
          {...widget}
          {...image}
        />
      </div>
    );
  }
}

export default Page;

Page.propTypes = {
  layout: PropTypes.string,
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
