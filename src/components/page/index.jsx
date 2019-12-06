/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import QAs from '../qas';
import { renderDef } from '../../lib/utilities.js';

class Page extends React.PureComponent {
  render() {
    // const {
    //   title,
    //   content,
    //   MediaTag,
    //   image,
    //   widget,
    //   questions,
    //   answers,
    //   activeAnswer,
    //   advanceActiveQuestion,
    //   setActiveQuestion,
    //   updateAnswer,
    //   activeQuestionId,
    //   options,
    // } = this.props;
    const { title, content, questions, MediaTag } = this.props;

    return (
      <div>
        <section>
          <h2 className="section-title">{title}</h2>
          <div dangerouslySetInnerHTML={renderDef(content)} />
          {questions && <QAs {...this.props} />}
        </section>
        <br />
        <MediaTag {...this.props} />
      </div>
    );
  }
}

export default Page;

Page.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  MediaTag: PropTypes.func,
  image: PropTypes.string,
  widget: PropTypes.object,
  options: PropTypes.object,
  questions: PropTypes.array,
  answers: PropTypes.object,
  activeId: PropTypes.string,
  updateAnswer: PropTypes.func,
  activeAnswer: PropTypes.object,
  activeQuestionId: PropTypes.string,
  advanceActiveQuestion: PropTypes.func,
  setActiveQuestion: PropTypes.func,
};
