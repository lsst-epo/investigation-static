/* eslint-disable react/no-danger, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import QAs from '../qas';
import { renderDef } from '../../lib/utilities.js';
import ObservationsTable from '../charts/shared/ObservationsTable';

class TwoCol extends React.PureComponent {
  render() {
    const { title, content, questions, answers, tables, MediaTag } = this.props;
    // console.log(tables);
    return (
      <div className="container-flex spaced">
        <div className="col padded col-width-50">
          <section>
            <h2 className="section-title">{title}</h2>
            <div dangerouslySetInnerHTML={renderDef(content)} />
            {tables &&
              tables.map(table => (
                <ObservationsTable
                  key={table.id}
                  answers={answers}
                  {...table}
                />
              ))}
            {questions && <QAs {...this.props} />}
          </section>
        </div>
        <div className="col padded col-width-50 col-fixed">
          <MediaTag {...this.props} />
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
  options: PropTypes.object,
  questions: PropTypes.array,
  answers: PropTypes.object,
  tables: PropTypes.array,
  activeId: PropTypes.string,
  updateAnswer: PropTypes.func,
  activeAnswer: PropTypes.object,
  activeQuestionId: PropTypes.string,
  advanceActiveQuestion: PropTypes.func,
  setActiveQuestion: PropTypes.func,
};
